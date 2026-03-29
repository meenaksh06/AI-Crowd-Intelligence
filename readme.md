# 📡 CrowdIntel AI: Campus crowd Intelligence System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-2.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![AI/ML](https://img.shields.io/badge/AI/ML-Powered-blue?logo=scikit-learn)](https://scikit-learn.org/)
[![Deploy](https://img.shields.io/badge/Deployment-Ready-brightgreen?logo=vercel)](https://vercel.com/)

**CrowdIntel AI** is a production-grade, AI-powered analytics platform designed to monitor and predict campus crowd density using passive WiFi telemetry. By analyzing 802.11 management frames (probe requests), the system provides real-time occupancy insights, historical trend analysis, and predictive forecasting—all while maintaining 100% user privacy through anonymization.

---

## 🚀 Key Features

*   **Premium Analytics Dashboard**: A stunning, dark-mode interface inspired by Vercel and Stripe, featuring real-time KPI cards and interactive zone occupancy bars.
*   **AI Forecasting Engine**: Uses **Polynomial Regression** to predict crowd density for the next 24 hours with high accuracy.
*   **Anomaly Detection**: Leverages **Isolation Forest** algorithms to automatically detect and flag unusual crowd spikes or unexpected gatherings.
*   **Privacy-First Design**: Implements SHA-256 MAC hashing and RSSI filtering to ensure telemetry remains anonymous and ethical.
*   **Scalable Architecture**: A modern stack featuring a FastAPI backend with Pydantic validation and a Next.js 14 App Router frontend.
*   **High-Fidelity Simulation**: Built-in "Campus Life" simulator to demonstrate real-world patterns (lunch rushes, study sessions) without hardware.

---

## 🧠 Technical Deep Dive

### 1. The ML Layer
The system employs a dual-model approach:
*   **Forecasting**: Cubic polynomial fitting on windowed historical data to model daily campus cycles.
*   **Anomalies**: Unsupervised learning via `IsolationForest` to identify outliers in occupancy flux.

### 2. The Networking Layer
Passive WiFi monitoring captures `802.11 Probe Requests`. These frames are:
1.  **Ingested**: Sent via REST API to the FastAPI backend.
2.  **Processed**: De-duplicated using hashed identifiers to count unique devices.
3.  **Estimated**: Converted to "Estimated People" using a tuned density coefficient and RSSI windowing.

### 3. The Tech Stack
*   **Frontend**: Next.js 14, Tailwind CSS, Recharts, Framer Motion, Lucide Icons.
*   **Backend**: FastAPI (Python), Pydantic v2, SQLAlchemy, Uvicorn.
*   **Science**: Scikit-Learn, Pandas, NumPy, Statsmodels.

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js 18+
*   Python 3.9+

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Generate Sample Data
Once the apps are running, click the **"Generate Insights"** button on the dashboard to trigger the high-fidelity simulator.

---

## 📊 Feature Preview

*   **Real-time Heatmaps**: Visualize zone occupancy percentage with color-coded status indicators.
*   **Predictive Trends**: View the AI's "Confidence Window" for future population peaks.
*   **Technical Deep Dive**: An "About" page that explains the system architecture to recruiters.

---

## 📋 Interview Focus
*   **Problem Solving**: Addressing privacy concerns in crowd monitoring using passive sensing.
*   **Engineering Quality**: Modularized backend with robust validation and Repository pattern.
*   **UI/UX**: Premium aesthetic focusing on glassmorphism and data storytelling.
*   **AI/ML**: Practical application of both supervised (regression) and unsupervised (isolation forest) learning.

---

**Developed as a production-grade AI/ML Engineering project.**
