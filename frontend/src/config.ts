const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_BASE = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
