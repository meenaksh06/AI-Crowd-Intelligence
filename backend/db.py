import sqlite3
import os
from datetime import datetime, timedelta

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(DB_DIR, 'aggregations.db')


def get_connection():
    con = sqlite3.connect(DB, timeout=30)
    con.row_factory = sqlite3.Row  # Enable row-based access
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA synchronous=NORMAL")
    return con


def init_db():
    con = get_connection()
    cur = con.cursor()
    
    cur.execute("""
    CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        minute TEXT NOT NULL,
        ap_id TEXT NOT NULL,
        device_hash TEXT NOT NULL,
        rssi INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    
    cur.execute("""
    CREATE TABLE IF NOT EXISTS aggregates (
        minute TEXT NOT NULL,
        ap_id TEXT NOT NULL,
        unique_devices INTEGER DEFAULT 0,
        mean_rssi REAL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (minute, ap_id)
    )""")
    
    cur.execute("CREATE INDEX IF NOT EXISTS idx_obs_minute ON observations(minute)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_obs_ap ON observations(ap_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_agg_ap ON aggregates(ap_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_agg_minute ON aggregates(minute)")
    
    con.commit()
    con.close()


def insert_probe(minute: str, ap_id: str, device_hash: str, rssi: int):
    con = get_connection()
    cur = con.cursor()
    cur.execute(
        'INSERT INTO observations (minute, ap_id, device_hash, rssi) VALUES (?, ?, ?, ?)',
        (minute, ap_id, device_hash, rssi)
    )
    con.commit()
    con.close()


def insert_probes_batch(probes: list):
    if not probes:
        return
    con = get_connection()
    cur = con.cursor()
    cur.executemany(
        'INSERT INTO observations (minute, ap_id, device_hash, rssi) VALUES (?, ?, ?, ?)',
        probes
    )
    con.commit()
    con.close()


def compute_aggregates():
    con = get_connection()
    cur = con.cursor()
    
    cur.execute('''
        SELECT minute, ap_id, 
               COUNT(DISTINCT device_hash) as unique_devices, 
               AVG(rssi) as mean_rssi 
        FROM observations 
        GROUP BY minute, ap_id
    ''')
    rows = cur.fetchall()
    
    for row in rows:
        cur.execute('''
            INSERT OR REPLACE INTO aggregates (minute, ap_id, unique_devices, mean_rssi, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (row['minute'], row['ap_id'], row['unique_devices'], row['mean_rssi']))
    
    con.commit()
    con.close()


def get_current_aggregates():
    con = get_connection()
    cur = con.cursor()
    
    cur.execute('''
        SELECT a.ap_id, a.unique_devices, a.mean_rssi
        FROM aggregates a
        INNER JOIN (
            SELECT ap_id, MAX(minute) as max_minute
            FROM aggregates
            GROUP BY ap_id
        ) latest ON a.ap_id = latest.ap_id AND a.minute = latest.max_minute
        ORDER BY a.ap_id
    ''')
    
    rows = cur.fetchall()
    con.close()
    
    return [dict(row) for row in rows]


def get_historical_data(hours: int = 24):
    con = get_connection()
    cur = con.cursor()
    
    time_threshold = (datetime.utcnow() - timedelta(hours=hours)).isoformat()
    
    cur.execute('''
        SELECT minute, ap_id, unique_devices, mean_rssi
        FROM aggregates
        WHERE minute >= ?
        ORDER BY minute ASC
    ''', (time_threshold,))
    
    rows = cur.fetchall()
    con.close()
    
    return [dict(row) for row in rows]


def clear_data():
    con = get_connection()
    cur = con.cursor()
    cur.execute('DELETE FROM observations')
    cur.execute('DELETE FROM aggregates')
    con.commit()
    con.close()
