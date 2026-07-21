# AI Organ Availability Prediction

> **IBM AI Builders Challenge — July 2025**
>
> Theme: *Reimagine Creative Industries with AI*

---

## 🏥 Project Overview

**AI Organ Availability Prediction** is a full-stack AI-powered web application that predicts the future availability of organs using historical data, donation trends, blood group demand, waiting-list data, and multiple weighted factors.

The application demonstrates how Artificial Intelligence can analyze complex medical data, identify patterns, and provide meaningful insights to support real-world decision-making in the healthcare domain.

---

## 🚀 Features

| Module | Description |
|---|---|
| 🤖 AI Prediction Engine | Weighted scoring algorithm across 8+ factors, confidence scores, explainable output |
| 📊 Dashboard | Real-time charts, organ demand vs. availability, monthly trends |
| 🏥 Patient Waiting List | Prioritized waiting list with AI-calculated priority scores |
| 📈 Demand Analytics | Interactive charts for organ demand, blood group analysis, hospital demand |
| 💡 AI Insights | Auto-generated insights using local prediction logic |
| 📋 Prediction History | Full history with CSV export |
| 🏨 Hospital Management | Manage hospital network, demand levels, and organ types |
| 💊 Organ Records | Track individual organ records, conditions, and availability status |
| ⚙️ Admin Dashboard | Full system administration with demo credential management |
| 🔒 Authentication | Supabase Auth + JWT, role-based access (Admin / Hospital Staff / Organ Coordinator) |

---

## 🆓 Technology Stack (100% Free)

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Recharts |
| Backend | Node.js + Express.js |
| Database | Supabase (Free Tier) |
| Authentication | Supabase Auth + JWT |
| Charts | Recharts (no API key required) |
| AI Engine | Local weighted scoring algorithm |
| Maps | OpenStreetMap / Nominatim (optional) |
| Styling | Custom CSS (no paid CSS framework) |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier)

### 1. Clone and install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** (`backend/.env`):
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_very_long_random_secret_key_here
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

### 3. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your Project URL and anon key from **Settings → API**
4. Open the SQL Editor and run the contents of `supabase_schema.sql`

### 4. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@organpredict.com | Admin@123 |
| Hospital Staff | staff@organpredict.com | Staff@123 |
| Organ Coordinator | coordinator@organpredict.com | Coord@123 |

> **Note:** These credentials work in mock mode (without Supabase) automatically.

---

## 🤖 AI Prediction Algorithm

The prediction engine uses a transparent, explainable weighted scoring model:

```
Prediction Score =
  Historical Availability Score  × 30%
  + Donation Trend Score         × 20%
  + Regional Availability Score  × 15%
  + Organ Demand Score           × 15%
  + Blood Group Availability     × 10%
  + Seasonal Trend Score         × 10%
```

**Classification:**
- 🟢 71–100 = **High Availability**
- 🟡 41–70 = **Medium Availability**
- 🔴 0–40 = **Low Availability**

Every prediction includes:
- Availability probability (0–100%)
- Confidence score
- Estimated availability timeframe
- Positive and negative factors
- Full explanation text

---

## 🗄️ Database Schema

```
users           → id, name, email, role, created_at
hospitals       → id, name, location, contact, organ_types, demand, patients
organ_records   → id, organ_type, blood_group, donor_age, condition, status
patients        → id, name, age, blood_group, required_organ, priority, status
predictions     → id, organ_type, score, level, confidence, factors, user_id
hospital_demand → id, hospital_id, organ_type, demand_level, patients
```

---

## 🔒 Security

- Supabase Authentication with Row Level Security (RLS)
- JWT token-based API authorization
- Role-based access control (Admin / Staff / Coordinator)
- Protected routes on both frontend and backend
- Environment variable management for all sensitive keys
- No hardcoded credentials anywhere

---

## ⚠️ Medical Disclaimer

This system is a **decision-support tool only** and must not replace medical professionals or official organ allocation authorities. All predictions are based on statistical models and should be interpreted by qualified healthcare professionals.

---

## 🏆 IBM AI Builders Challenge

This project was developed for the **IBM AI Builders Challenge — July 2025**.

**Theme:** Reimagine Creative Industries with AI

The application demonstrates:
- ✅ AI-powered prediction using explainable algorithms
- ✅ Data-driven decision-making in critical healthcare
- ✅ Intelligent automation of complex prioritization
- ✅ Real-world impact in organ transplantation
- ✅ Transparent, interpretable AI (no black box)
- ✅ 100% free technology stack

---

*Built with React · Node.js · Supabase · Recharts · Free Open-Source Technologies Only*
