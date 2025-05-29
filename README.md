# 🧠 AI Quiz App

A full-stack themed quiz platform with achievements, built using:

- 🐍 FastAPI (Python) backend
- ⚛️ React + Vite frontend
- 🧠 Optional AI quiz generation (OpenAI API)
- 🛡️ JWT Auth + PostgreSQL
- 🮀 Ready to migrate backend to Rust or Go in the future

---

## 📦 Tech Stack

| Layer    | Stack                     |
|----------|---------------------------|
| Backend  | FastAPI, SQLAlchemy       |
| Frontend | React, Vite, Tailwind CSS |
| DB       | PostgreSQL                |
| Auth     | JWT                       |

---

## 🚀 Quick Start

### 🔧 1. Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate  # or .\\env\\Scripts\\activate on Windows 
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

alembic revision --autogenerate -m "Add quiz_submission table"
alembic upgrade head

uvicorn app.main:app --reload
```

- Configure environment in `.env` (e.g. DB URL, JWT secret)
- Docs available at: `http://localhost:8000/docs`

### ⚛️ 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Runs at: `http://localhost:5173`
- Make sure backend CORS allows this origin

---

## 🌐 API Endpoints

| Method | Endpoint             | Description             |
|--------|----------------------|-------------------------|
| GET    | `/quizzes/`          | Get all quiz themes     |
| GET    | `/quizzes/{id}`      | Get quiz for theme      |
| POST   | `/quizzes/submit`    | Submit quiz answers     |
| POST   | `/auth/login`        | Login with credentials  |
| GET    | `/users/{id}`        | Get user achievements   |

---

## 🔄 Future-Proofing for Rust/Go

This app is written in a backend-agnostic way:

- RESTful routes return consistent JSON
- Pydantic schemas mirror Rust's `serde` or Go `structs`
- Frontend uses Axios for clean HTTP-based API calls

You can rewrite the backend in:
- **Rust** using Axum + `sqlx`
- **Go** using Gin + GORM

---

## 📊 Features Roadmap

- [x] Quiz by themes
- [x] Achievements by theme & global
- [ ] AI-based quiz generation (OpenAI)
- [ ] Web3 token rewards (NFTs or SBTs)
- [ ] Leaderboards

---

## 🛡️ License

MIT — feel free to use, modify, and build upon it.
```


| Action    | Method | Route           | Auth Required |
| --------- | ------ | --------------- | ------------- |
| Create    | POST   | `/quizzes/`     | ✅ Yes         |
| List All  | GET    | `/quizzes/`     | ❌ No          |
| Get by ID | GET    | `/quizzes/{id}` | ❌ No          |
| Update    | PUT    | `/quizzes/{id}` | ✅ Yes (owner) |
| Delete    | DELETE | `/quizzes/{id}` | ✅ Yes (owner) |


komaQuizV2
├─ backend
│  ├─ .env
│  ├─ alembic
│  │  ├─ env.py
│  │  ├─ README
│  │  ├─ script.py.mako
│  │  └─ versions
│  ├─ alembic.ini
│  ├─ app
│  │  ├─ core
│  │  ├─ db.py
│  │  ├─ main.py
│  │  ├─ models
│  │  │  └─ user.py
│  │  ├─ routes
│  │  │  ├─ auth.py
│  │  │  ├─ quiz.py
│  │  │  ├─ user.py
│  │  │  └─ __pycache__
│  │  │     ├─ auth.cpython-312.pyc
│  │  │     ├─ quiz.cpython-312.pyc
│  │  │     └─ user.cpython-312.pyc
│  │  ├─ schemas
│  │  ├─ services
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ db.cpython-312.pyc
│  │     ├─ main.cpython-312.pyc
│  │     └─ __init__.cpython-312.pyc
│  ├─ requirements.txt
│  └─ venv
│     ├─ Include
│     │  └─ site
│     │     └─ python3.12
│     │        └─ greenlet
│     │           └─ greenlet.h
│
└─ README.md

```