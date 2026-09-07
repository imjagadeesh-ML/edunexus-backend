# 🎓 EduNexus

> **AI-Powered Academic Intelligence, Career Readiness & Student Growth Platform**

EduNexus is an intelligent higher education platform designed for engineering institutions. It bridges the gap between academic curricula and industry expectations by providing predictive placement analytics, early burnout detection, multi-year curriculum skill mappings, and automated accreditation (NAAC/NBA) reporting.

---

## 🚀 Key Features

* **📈 Placement Probability Engine:** Predicts a student's placement readiness score based on academic grades, attendance, completed projects, and technical skills with interactive "What-If" scenario simulation.
* **⚠️ Early Burnout & Stress Detection:** Monitors continuous academic workload, assignment density, and attendance drops to alert faculty and students before academic burnout occurs.
* **🗺️ 4-Year B.Tech Career Roadmap:** Personalized milestone tracks guiding students from Year 1 fundamentals to Year 4 interview prep and capstone projects.
* **📊 NAAC & NBA Accreditation Reporting:** Automated report generator for department heads and faculty to audit cohort readiness, curriculum efficacy, and outcome metrics.
* **🤝 Campus Collaboration Hub:** A shared repository for lecture notes, previous exam papers, lab records, and real-time campus notifications.
* **🔐 Secure Authentication:** Full JWT (OAuth2 Bearer) token-based authentication with bcrypt password hashing.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, React Router DOM v7, Recharts, Framer Motion, Lucide React, Axios |
| **Backend** | Python 3.12, FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic, Python-JOSE (JWT), Passlib (Bcrypt) |
| **Database** | **Development:** SQLite (`edunexus.db`)<br>**Production:** PostgreSQL (Supabase with connection pooling) |
| **Cloud & Tools** | Render (Web Service), Git / GitHub, npm, pip |

---

## 📁 Project Structure

```text
edunexus/
├── app/
│   ├── core/           # Security, JWT, and application configuration
│   ├── routers/        # API routers (auth, students, predictions, collaboration)
│   ├── services/       # Analytics engines (placement, burnout, scoring, reports, roadmap)
│   ├── scripts/        # Database seeding utilities
│   ├── database.py     # SQLAlchemy DB engine (dual SQLite / PostgreSQL support)
│   ├── models.py       # Database schema models
│   ├── schemas.py      # Pydantic request / response schemas
│   ├── crud.py         # Database query operations
│   └── main.py         # FastAPI application entry point
├── frontend/
│   ├── src/
│   │   ├── api/        # Axios client with JWT interceptor
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth context & state management
│   │   ├── pages/      # Application views (Dashboard, Curriculum, Predictions, etc.)
│   │   ├── App.jsx     # Route declarations
│   │   └── main.jsx    # React DOM root
│   ├── package.json
│   └── vite.config.js
├── DEPLOYMENT.md       # Render + Supabase cloud deployment guide
├── requirements.txt    # Python backend dependencies
├── run.py              # Backend local development runner
└── render.yaml         # Render deployment blueprint
```

---

## ⚡ Getting Started

### Prerequisites
* **Python** 3.12+
* **Node.js** 18+ and **npm**

---

### 1. Backend Setup

1. **Activate the virtual environment:**
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\activate

   # macOS / Linux
   source venv/bin/activate
   ```

2. **Install backend dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   Ensure a `.env` file exists in the root directory:
   ```env
   ENVIRONMENT=development
   PROJECT_NAME="EduNexus AI"
   VERSION="1.0.0"
   SECRET_KEY=b9c4c5b36412f7a0dc4f5b3512b8b9a103d8d69fae5cfe15c7e14f6b2e1b1d2e
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   DATABASE_URL=sqlite:///./edunexus.db
   BACKEND_CORS_ORIGINS=["*"]
   ```

4. **Run the backend server:**
   ```bash
   python run.py
   ```
   * Server runs at: `http://127.0.0.1:8000`
   * Swagger Documentation: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   * App runs at: `http://localhost:5173`

---

## 🔑 Demo Account

You can log in directly using the pre-configured demo account:

* **Email:** `student@edunexus.ai`
* **Password:** `demo123`

*(Alternatively, register a new student account directly from the login page.)*

---

## 🌐 Production Deployment

The project is pre-configured for one-click deployment:
* **Backend:** Hosted on **Render** (via `render.yaml` or manual Web Service)
* **Database:** Hosted on **Supabase** (PostgreSQL pooler on port 6543)
* See [DEPLOYMENT.md](DEPLOYMENT.md) for full step-by-step deployment instructions.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
