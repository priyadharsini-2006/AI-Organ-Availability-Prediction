# 🏥 AI Organ Availability Prediction

> **Predicting Availability. Supporting Decisions. Improving Preparedness.**

**IBM AI Builders Challenge 2026 — July Challenge**
**Challenge Theme:** Reimagine Creative Industries with AI

---

## 📌 Project Overview

**AI Organ Availability Prediction** is a full-stack AI-powered healthcare decision-support platform designed to predict the potential future availability of organs using historical availability data, donation trends, regional factors, blood-group availability, demand patterns, waiting-list information, and other weighted factors.

Organ transplantation involves complex coordination between patients, hospitals, donors, organ availability, blood-group compatibility, demand levels, and waiting-list priorities.

The platform demonstrates how Artificial Intelligence and data-driven prediction techniques can analyze multiple factors, identify patterns, calculate explainable availability scores, and generate meaningful insights that may support planning and decision-making.

AI Organ Availability Prediction brings together:

* AI-powered organ availability prediction
* Patient waiting-list management
* Hospital network management
* Organ record management
* Demand analytics
* Prediction history
* Explainable AI insights
* Role-based authentication
* Administrative controls

The goal of the platform is not to replace medical professionals, transplant organizations, or official organ-allocation systems.

The goal is to demonstrate how transparent and explainable AI-assisted prediction can support data analysis, preparedness, and informed decision-making in healthcare.

---

## 🎯 Selected Challenge Theme

### Reimagine Creative Industries with AI

The IBM AI Builders Challenge explores how Artificial Intelligence can transform existing workflows, improve decision-making, automate complex processes, and enable innovative approaches to real-world problems.

AI Organ Availability Prediction demonstrates the broader transformative potential of AI by applying intelligent prediction and data-driven analysis to a complex healthcare challenge.

The platform focuses on:

* AI-powered predictive analytics
* Data-driven healthcare insights
* Explainable prediction models
* Intelligent prioritization
* Demand and availability analysis
* Healthcare data visualization
* Automated insight generation
* Decision-support technology

The project demonstrates how AI techniques can analyze multiple interconnected factors and transform complex datasets into understandable and actionable insights.

---

## ❗ Problem Statement

Organ transplantation is a highly complex and time-sensitive healthcare process.

Patients waiting for organ transplants may depend on several interconnected factors, including:

* Organ availability
* Blood-group compatibility
* Regional availability
* Donation trends
* Patient demand
* Waiting-list size
* Hospital demand
* Seasonal patterns
* Historical availability

Understanding potential organ availability across these different factors can be difficult when information is distributed across multiple systems or analyzed manually.

Healthcare organizations and coordinators may need to evaluate large amounts of information to understand:

* Which organs have higher or lower expected availability
* Which blood groups may experience greater demand
* Which hospitals have higher organ requirements
* How donation trends change over time
* Which patients require higher priority
* How availability patterns may change in the future

Traditional dashboards can display historical data, but they may not automatically transform that information into predictive insights.

The challenge is therefore not simply:

> "How can we store organ and patient data?"

The larger challenge is:

> "How can AI analyze multiple healthcare data factors and generate transparent, explainable predictions that support better planning and decision-making?"

---

## 💡 Solution Description

AI Organ Availability Prediction introduces an integrated AI-powered prediction and analytics platform.

The system combines historical information, donation trends, regional availability, demand levels, blood-group availability, and seasonal patterns through a transparent weighted scoring algorithm.

The overall workflow is:

```text
                     HEALTHCARE DATA
                           │
                           ▼
              ┌─────────────────────────┐
              │ Historical Availability │
              │ Donation Trends         │
              │ Regional Availability   │
              │ Organ Demand            │
              │ Blood Group Data        │
              │ Seasonal Trends         │
              └────────────┬────────────┘
                           │
                           ▼
                 🤖 AI PREDICTION ENGINE
                           │
                           ▼
                 WEIGHTED SCORE ANALYSIS
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
           HIGH          MEDIUM          LOW
       AVAILABILITY   AVAILABILITY   AVAILABILITY
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                 EXPLAINABLE AI OUTPUT
                           │
                           ▼
              CONFIDENCE + TIMEFRAME
                           │
                           ▼
                  DECISION SUPPORT
```

Instead of providing only a prediction label, the platform generates structured prediction information including:

* Availability probability
* Availability classification
* Confidence score
* Estimated availability timeframe
* Positive contributing factors
* Negative contributing factors
* Human-readable explanation

This makes the prediction process more transparent and understandable.

---

## 🤖 AI Prediction Engine

The core of the application is its explainable weighted scoring prediction engine.

The engine evaluates multiple factors that may influence potential organ availability.

### Prediction Formula

```text
Prediction Score =

Historical Availability Score × 30%
+
Donation Trend Score          × 20%
+
Regional Availability Score   × 15%
+
Organ Demand Score            × 15%
+
Blood Group Availability      × 10%
+
Seasonal Trend Score          × 10%
```

The calculated score is converted into an availability classification.

### Classification

| Score     | Availability        |
| --------- | ------------------- |
| 🟢 71–100 | High Availability   |
| 🟡 41–70  | Medium Availability |
| 🔴 0–40   | Low Availability    |

Every prediction can include:

* Availability probability from 0–100%
* Confidence score
* Estimated availability timeframe
* Positive influencing factors
* Negative influencing factors
* Detailed explanation

The algorithm is designed to be transparent and interpretable rather than operating as an unexplained black-box prediction.

---

## ✨ Key Features

### 🤖 AI Prediction Engine

Analyzes multiple weighted factors to estimate potential organ availability.

Provides:

* Prediction score
* Availability level
* Confidence score
* Estimated timeframe
* Contributing factors
* Explainable output

### 📊 Dashboard

Provides a centralized overview of important platform information.

The dashboard can display:

* Organ availability statistics
* Organ demand levels
* Patient waiting-list information
* Hospital statistics
* Recent predictions
* Availability trends
* Demand versus availability charts

### 🏥 Patient Waiting List

Manages patients who are waiting for organ transplantation.

Patient information can include:

* Patient name
* Age
* Blood group
* Required organ
* Priority
* Current status

The platform can support AI-assisted priority calculations for organizing waiting-list information.

### 📈 Demand Analytics

Provides visual analytics for understanding organ demand patterns.

Analytics can include:

* Organ demand
* Availability trends
* Blood-group analysis
* Hospital demand
* Monthly trends
* Demand versus availability

Interactive charts are powered using Recharts.

### 💡 AI Insights

Generates understandable insights from prediction and analytics data.

These insights can highlight:

* High-demand organs
* Potential shortages
* Availability trends
* Blood-group patterns
* Hospital demand changes
* Important prediction factors

### 📋 Prediction History

Stores previous prediction results for future reference and analysis.

Users can review:

* Organ type
* Prediction score
* Availability level
* Confidence
* Prediction factors
* Prediction date

Prediction data can also be exported in CSV format where supported.

### 🏨 Hospital Management

Provides functionality for managing hospitals participating in the platform.

Hospital information can include:

* Hospital name
* Location
* Contact details
* Supported organ types
* Demand levels
* Number of patients

### 💊 Organ Records

Provides centralized management of organ-related records.

Records can contain:

* Organ type
* Blood group
* Donor age
* Organ condition
* Availability status

### ⚙️ Admin Dashboard

Provides administrative functionality for managing the application.

Administrative features can include:

* User management
* Hospital management
* Organ records
* System statistics
* Role management
* Platform monitoring

### 🔒 Authentication and Authorization

The application supports secure authentication and role-based access.

Supported roles include:

* Admin
* Hospital Staff
* Organ Coordinator

The architecture uses Supabase Authentication and JWT-based authorization.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────┐
│                    USER                     │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              REACT + VITE FRONTEND          │
│                                             │
│  Authentication                             │
│  Dashboard                                  │
│  Predictions                                │
│  Patient Waiting List                       │
│  Organ Records                              │
│  Hospital Management                        │
│  Analytics                                  │
│  Admin Dashboard                            │
└─────────────────────┬───────────────────────┘
                      │
                      │ REST API
                      ▼
┌─────────────────────────────────────────────┐
│             NODE.JS + EXPRESS API           │
│                                             │
│  Authentication                             │
│  Organ Management                           │
│  Patient Management                         │
│  Hospital Management                        │
│  Prediction Services                        │
│  Dashboard Services                         │
│  Analytics Services                         │
└─────────────────────┬───────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────────┐  ┌─────────────────────┐
│ AI PREDICTION ENGINE│  │      SUPABASE       │
│                     │  │                     │
│ Weighted Scoring    │  │ PostgreSQL Database │
│ Confidence          │  │ Authentication      │
│ Explainability      │  │ Row Level Security  │
│ Insights            │  │ Persistent Data     │
└─────────────────────┘  └─────────────────────┘
```

---

## 🔄 Application Workflow

### Step 1 — User Authentication

The user logs into the platform using an authorized account.

Role-based access determines which features are available.

### Step 2 — Dashboard

The user views an overview of:

* Organ availability
* Patient statistics
* Hospital demand
* Recent predictions
* Important trends

### Step 3 — Prediction Request

The user provides the required information for an organ availability prediction.

### Step 4 — Data Analysis

The backend processes relevant prediction factors.

### Step 5 — AI Prediction

The weighted prediction engine calculates an availability score.

### Step 6 — Classification

The prediction is classified as:

* High Availability
* Medium Availability
* Low Availability

### Step 7 — Explainable Results

The system presents:

* Probability
* Confidence
* Timeframe
* Positive factors
* Negative factors
* Explanation

### Step 8 — Prediction Storage

Prediction results can be stored in the database for history and future analysis.

### Step 9 — Analytics

Stored information contributes to dashboards and analytical visualizations.

---

## 🛠️ Technology Stack

### Frontend

* React 18
* Vite
* JavaScript
* Recharts
* Custom CSS
* REST API integration
* Responsive web interface

### Backend

* Node.js
* Express.js
* REST API architecture
* JWT authentication
* CORS
* Environment-based configuration

### Database

* Supabase
* PostgreSQL
* Row Level Security
* Persistent cloud database

### Authentication

* Supabase Authentication
* JWT
* Role-based access control

### AI / Prediction

* Local weighted scoring algorithm
* Explainable prediction logic
* Confidence scoring
* Factor analysis
* Automated insights

### Data Visualization

* Recharts

### Optional Maps

* OpenStreetMap
* Nominatim

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm
* Node.js

---

## 🗄️ Database Schema

```text
users
├── id
├── name
├── email
├── role
└── created_at

hospitals
├── id
├── name
├── location
├── contact
├── organ_types
├── demand
└── patients

organ_records
├── id
├── organ_type
├── blood_group
├── donor_age
├── condition
└── status

patients
├── id
├── name
├── age
├── blood_group
├── required_organ
├── priority
└── status

predictions
├── id
├── organ_type
├── score
├── level
├── confidence
├── factors
└── user_id

hospital_demand
├── id
├── hospital_id
├── organ_type
├── demand_level
└── patients
```

---

## 🔌 Core API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Organ Management

```text
GET    /api/organs
POST   /api/organs
PUT    /api/organs/:id
DELETE /api/organs/:id
```

### Predictions

```text
POST /api/predictions
GET  /api/predictions
GET  /api/predictions/:id
```

### Patients

```text
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Hospitals

```text
GET    /api/hospitals
POST   /api/hospitals
PUT    /api/hospitals/:id
DELETE /api/hospitals/:id
```

---

## 🔒 Security

AI Organ Availability Prediction includes multiple security mechanisms.

* Supabase Authentication
* JWT token-based API authorization
* Role-based access control
* Protected frontend routes
* Protected backend endpoints
* Supabase Row Level Security
* Environment-variable management
* Secure handling of database credentials
* Separate frontend and backend environment configuration

Sensitive credentials should never be committed to the public GitHub repository.

---

## 🔑 Demo Credentials

| Role              | Email                                                               | Password  |
| ----------------- | ------------------------------------------------------------------- | --------- |
| Admin             | [admin@organpredict.com](mailto:admin@organpredict.com)             | Admin@123 |
| Hospital Staff    | [staff@organpredict.com](mailto:staff@organpredict.com)             | Staff@123 |
| Organ Coordinator | [coordinator@organpredict.com](mailto:coordinator@organpredict.com) | Coord@123 |

> **Note:** Demo credentials should only be publicly documented if they are specifically created as safe demonstration accounts. Never expose real user or administrative production credentials.

---

## 📁 Project Structure

```text
AI-Organ-Availability-Prediction/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
├── supabase_schema.sql
├── .gitignore
├── LICENSE
└── README.md
```

> The exact folder structure should be updated to match the final GitHub repository.

---

## 🚀 Getting Started

### Prerequisites

Install:

* Git
* Node.js 18+
* npm
* Supabase account

---

### 1. Clone the Repository

```bash
git clone https://github.com/priyadharsini-2006/AI-Organ-Availability-Prediction.git
cd AI-Organ-Availability-Prediction
```

---

## ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the backend environment file:

```text
backend/.env
```

Configure:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_very_long_random_secret_key_here
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

---

## 💻 Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file:

```text
frontend/.env
```

Configure:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🗃️ Supabase Setup

1. Create a Supabase account.
2. Create a new project.
3. Open the project dashboard.
4. Copy the Project URL.
5. Copy the required public/anon key.
6. Configure the backend environment variables.
7. Configure the frontend environment variables.
8. Open the Supabase SQL Editor.
9. Run the SQL schema from `supabase_schema.sql`.
10. Configure Row Level Security policies where required.
11. Test authentication and database operations.

Never expose the Supabase service-role key in the frontend.

---

## 🌐 Deployment Architecture

The production application can use the following deployment architecture:

```text
                    USER
                      │
                      ▼
             VERCEL FRONTEND
             React + Vite App
                      │
                      │ HTTPS REST API
                      ▼
              RENDER BACKEND
            Node.js + Express API
                      │
                      ▼
                 SUPABASE
          Database + Authentication
                      │
                      ▼
             PREDICTION ENGINE
```

### Frontend

Deployed using Vercel.

### Backend

Deployed using Render.

### Database

Hosted using Supabase.

This allows the complete application to operate using cloud-hosted services.

---

## 📸 Screenshots

Screenshots of the completed application can be stored in the `screenshots` directory.

Recommended screenshots:

* Landing Page
* Login Page
* Dashboard
* AI Prediction Page
* Prediction Results
* Patient Waiting List
* Organ Records
* Hospital Management
* Demand Analytics
* Prediction History
* Admin Dashboard

---

## 🎥 Demo Video

**Public Demo Video:**

`<ADD_PUBLIC_DEMO_VIDEO_LINK>`

The demonstration video can showcase:

* Problem statement
* Proposed solution
* Application login
* Dashboard
* AI organ availability prediction
* Explainable prediction results
* Patient waiting list
* Hospital management
* Analytics
* Technology architecture
* Real-world impact

---

## 🌐 Live Application

**Live Demo:**

https://ai-organ-availability-prediction-priyadharshini4.vercel.app

**Backend API:**

https://ai-organ-availability-prediction.onrender.com

**GitHub Repository:**

https://github.com/priyadharsini-2006/AI-Organ-Availability-Prediction

---

## 🌍 Real-World Impact

AI Organ Availability Prediction demonstrates how predictive analytics can potentially support healthcare planning and organ-transplantation-related data analysis.

Potential users and stakeholders include:

* Hospitals
* Healthcare administrators
* Transplant coordinators
* Organ donation organizations
* Healthcare researchers
* Data analysts
* Medical technology teams

The platform can help demonstrate how historical and current data may be transformed into understandable predictive insights.

The system is designed as a decision-support and demonstration platform.

It does not make official organ-allocation decisions.

---

## 💎 Innovation

The key innovation of AI Organ Availability Prediction is the combination of transparent prediction, healthcare data management, and explainable analytics within a unified platform.

Instead of:

```text
Healthcare Data
      ↓
Static Dashboard
```

The system introduces:

```text
                    Healthcare Data
                          │
                          ▼
                 Multi-Factor Analysis
                          │
                          ▼
                 AI Prediction Engine
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
      Probability     Confidence      Factors
           │              │              │
           └──────────────┼──────────────┘
                          ▼
                  Explainable Result
                          │
                          ▼
                   Visual Analytics
                          │
                          ▼
                   Decision Support
```

The system emphasizes explainability by showing the factors contributing to predictions rather than presenting only an unexplained final result.

---

## 🔮 Future Improvements

Future versions of AI Organ Availability Prediction could explore:

* Machine-learning models trained on validated healthcare datasets
* Advanced time-series forecasting
* Geographic availability analysis
* Real-time hospital data integration
* Advanced blood-group compatibility analysis
* Secure healthcare interoperability standards
* Improved prediction explainability
* Mobile application support
* Real-time notification systems
* Advanced reporting
* Multilingual interfaces
* Federated learning for privacy-preserving healthcare AI

Any real-world medical implementation would require appropriate clinical validation, data governance, security controls, regulatory compliance, and integration with authorized organ-allocation systems.

---

## ⚠️ Medical Disclaimer

**AI Organ Availability Prediction is a demonstration and decision-support system only.**

The application must not be used as a replacement for:

* Qualified medical professionals
* Transplant specialists
* Authorized organ-allocation organizations
* Official transplant waiting lists
* Clinical decision-making systems
* Emergency medical services

Predictions generated by the platform are based on statistical or algorithmic factors and do not guarantee actual organ availability.

All medical and organ-allocation decisions must be made by qualified professionals and authorized organizations according to applicable healthcare regulations and policies.

---

## 🏆 IBM AI Builders Challenge Submission

| Field            | Details                                                 |
| ---------------- | ------------------------------------------------------- |
| Project          | AI Organ Availability Prediction                        |
| Challenge        | IBM AI Builders Challenge 2026                          |
| Selected Theme   | July Challenge — Reimagine Creative Industries with AI  |
| Solution Type    | AI-Powered Healthcare Prediction Platform               |
| Application Type | Full-Stack Web Application                              |
| Frontend         | React + Vite                                            |
| Backend          | Node.js + Express                                       |
| Database         | Supabase                                                |
| AI Approach      | Explainable Weighted Prediction Algorithm               |
| Deployment       | Vercel + Render + Supabase                              |
| Category         | Healthcare AI / Predictive Analytics / Decision Support |

---

## ✅ Submission Checklist

* Working AI Organ Availability Prediction prototype
* Prediction engine tested
* Frontend connected to backend
* Supabase database configured
* Authentication tested
* Patient management tested
* Organ management tested
* Hospital management tested
* Prediction history tested
* Analytics tested
* Public GitHub repository
* Complete root README
* `.env.example` files included
* No API keys or secrets exposed in GitHub
* Production frontend deployed
* Production backend deployed
* Frontend connected to production backend
* Real application screenshots added
* Public live demo link added
* Public demo/presentation video added
* Demo video within challenge time limit
* Required IBM SkillsBuild learning activity completed
* IBM SkillsBuild completion certificate obtained
* Required completion proof uploaded
* Team member details completed
* Challenge submission page completed
* Final project published before the deadline

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 🙏 Acknowledgements

* IBM AI Builders Challenge — Challenge platform and opportunity
* IBM SkillsBuild — Learning resources supporting the challenge
* Supabase — Database and authentication infrastructure
* React — Frontend application library
* Vite — Frontend development and build tooling
* Node.js — Backend JavaScript runtime
* Express.js — Backend web framework
* Recharts — Data visualization library
* Vercel — Frontend deployment platform
* Render — Backend deployment platform
* Open-source development ecosystem — Supporting technologies used to build the application

---

# 🏥 AI Organ Availability Prediction

**Predicting Availability. Supporting Decisions. Improving Preparedness.**

Built for the **IBM AI Builders Challenge 2026**

**July Challenge — Reimagine Creative Industries with AI**

*Using explainable AI-powered prediction and data analytics to demonstrate the potential of intelligent healthcare decision-support systems.*
