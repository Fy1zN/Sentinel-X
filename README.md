<div align="center">

# 🛡️ SentinelX

### Real-Time Cyber Threat Intelligence & SOC Platform

<img src="https://img.shields.io/badge/Cybersecurity-SOC%20Platform-00F5FF?style=for-the-badge&logo=shield&logoColor=black" />
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/WebSockets-Live%20Telemetry-ff4d4d?style=for-the-badge" />
<img src="https://img.shields.io/badge/MITRE-ATT%26CK-red?style=for-the-badge" />
<img src="https://img.shields.io/badge/Threat-Intelligence-blueviolet?style=for-the-badge" />
<img src="https://img.shields.io/badge/PDF-Reporting-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

---

### Enterprise-grade cybersecurity intelligence platform for IOC analysis, threat correlation, watchlists, MITRE ATT&CK mapping, SOC analytics, PDF intelligence reporting, and websocket-powered threat telemetry.

</div>

---

# 📌 Overview

SentinelX is a full-stack real-time cybersecurity intelligence and SOC simulation platform built for threat monitoring, IOC investigation, cyber threat analytics, and intelligence reporting.

The platform integrates multiple threat intelligence APIs, live IOC analysis, risk scoring, MITRE ATT&CK mapping, websocket-powered telemetry, analytics dashboards, watchlist monitoring, and automated PDF intelligence reporting into a unified SOC-style environment.

SentinelX simulates real-world Security Operations Center (SOC) workflows used in enterprise cybersecurity infrastructures.

---

# ✨ Core Features

✅ IOC Intelligence Engine  
✅ Threat Correlation System  
✅ MITRE ATT&CK Mapping  
✅ Real-Time WebSocket Telemetry  
✅ SOC Analytics Dashboard  
✅ Threat Intelligence API Integrations  
✅ Watchlist Monitoring System  
✅ PDF Intelligence Reporting  
✅ Live Threat Activity Feed  
✅ Threat Severity Classification  
✅ Historical IOC Tracking  
✅ Multi-Source Threat Aggregation  

---

# ⚡ Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- ShadCN UI
- Lucide Icons

## Backend
- FastAPI
- Python
- SQLAlchemy
- WebSockets
- JWT Authentication,Oauth2
- ReportLab PDF Engine

## Database
- PostgreSQL

## Threat Intelligence APIs
- VirusTotal API
- AlienVault OTX API
- MalwareBazaar API
- URLHaus API
- AbuseIPDB API
- NVD CVE API

---

# 🛰️ Threat Intelligence Modules

## IOC Intelligence Engine
Analyze:
- IP addresses
- Domains
- URLs
- Malware hashes
- Email indicators

Features:
- IOC enrichment
- Threat scoring
- Geo intelligence
- IOC history tracking
- Multi-source intelligence aggregation

---

## 🧠 Threat Correlation Engine

Correlates indicators using:
- IOC similarity analysis
- Rule-based attack mapping
- Threat aggregation logic
- MITRE ATT&CK techniques
- Severity inference

---

## 🔴 Real-Time WebSocket Telemetry

SentinelX includes websocket-powered real-time infrastructure supporting:

- Live SOC activity feeds
- Instant IOC broadcasts
- Real-time telemetry streaming
- Dashboard synchronization
- Live threat monitoring
- Event broadcasting architecture

---

## 📊 SOC Analytics Dashboard

Real-time cybersecurity analytics featuring:

- Threat distribution
- IOC severity analytics
- Attack category visualization
- Country-based threat analytics
- 24-hour activity monitoring
- Live SOC activity feeds
- Dynamic chart rendering

---

## 🛡️ Watchlist Monitoring

Track suspicious infrastructure and malicious indicators.

Capabilities:
- Add/remove IOC watchlists
- Active/inactive monitoring
- Persistent IOC tracking
- Threat match checking
- Live watchlist management

---

## 📄 Threat Intelligence Reporting

Generate downloadable intelligence reports including:

- IOC details
- Threat severity scoring
- MITRE ATT&CK mappings
- Threat intelligence sources
- Analyst notes
- Investigation summaries

Exports:
- PDF intelligence reports

---

# 🏗️ Architecture

```text
┌───────────────────────────────┐
│           Frontend            │
│        Next.js + TSX          │
└──────────────┬────────────────┘
               │ REST API
               │ WebSockets
┌──────────────▼────────────────┐
│            Backend            │
│     FastAPI + SQLAlchemy      │
└──────────────┬────────────────┘
               │
     ┌─────────▼─────────┐
     │    PostgreSQL     │
     │     Database      │
     └─────────┬─────────┘
               │
┌──────────────▼────────────────────────────┐
│       Threat Intelligence APIs            │
│ VirusTotal • OTX • MalwareBazaar • NVD   │
│ URLHaus • AbuseIPDB                       │
└───────────────────────────────────────────┘



Installation
1. Clone Repository
git clone https://github.com/Fy1zN/Sentinel-X.git
2. Frontend Setup
cd app
npm install
npm run dev

Frontend runs on:

http://localhost:3000
3. Backend Setup
cd backend
python -m venv venv
Activate Virtual Environment

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run backend:

uvicorn app.main:app --reload

Backend runs on:

http://127.0.0.1:8000
🔐 Environment Variables

Create:

backend/.env

Add:

DATABASE_URL=postgresql://username:password@localhost/sentinelx

VIRUSTOTAL_API_KEY=your_key

OTX_API_KEY=your_key

ABUSEIPDB_API_KEY=your_key

JWT_SECRET_KEY=your_secret

📚 API Documentation

FastAPI Swagger Docs:

http://127.0.0.1:8000/docs


🎯 Project Highlights
Full-stack cybersecurity platform
Real-time SOC simulation architecture
Enterprise dashboard design
Websocket-powered telemetry
MITRE ATT&CK integration
Threat intelligence aggregation
PDF intelligence reporting
IOC investigation workflows
Real-time analytics engine
Threat monitoring infrastructure


🔮 Future Enhancements
Planned Features
AI-generated investigation summaries
SIEM integrations
Sigma rule generation
STIX/TAXII support
Threat actor attribution
Malware sandbox integration
Live threat notifications
Advanced websocket telemetry
Docker deployment
Kubernetes orchestration
RBAC authorization
AI threat classification



🛡️ Security Features

JWT Authentication
Oauth, Ouath2 Authentication
IOC Risk Scoring
Threat Intelligence Aggregation
Real-Time WebSocket Monitoring
Persistent Investigation Logging
SOC-style Threat Monitoring



💡 Use Cases

SentinelX can be used for:

SOC workflow simulations
Cybersecurity portfolio projects
Threat intelligence demonstrations
Blue-team environments
IOC investigations
Security research
Cybersecurity hackathons
Threat analytics demonstrations



👨‍💻 Author
Krish Malhotra

Cybersecurity • Threat Intelligence • AI • Full-Stack Development

GitHub:

https://github.com/Fy1zN

📜 License

This project is licensed under the MIT License.

