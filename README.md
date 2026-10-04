# FastAPI Auth & CRUD System

A professional REST API template built with **FastAPI**, featuring a complete authentication system (JWT), CRUD operations, Rate Limiting, and a beautiful Glassmorphism frontend UI.

## 🚀 Features

- **FastAPI Backend**: High performance async API.
- **Authentication**: Secure password hashing with `passlib` (bcrypt) and JWT tokens (`python-jose`).
- **Database**: SQLAlchemy ORM with SQLite (easily swappable for PostgreSQL).
- **Rate Limiting**: Protection against brute-force and spam using `slowapi`.
- **Frontend**: A sleek, responsive, single-page application built with Vanilla JS, CSS (Glassmorphism), and HTML.
- **Dockerized**: Ready to deploy and run instantly using Docker and Docker Compose.

## 📁 Project Structure

```
.
├── app/
│   ├── main.py          # FastAPI application & entry point
│   ├── auth.py          # JWT and Password Hashing utilities
│   ├── database.py      # SQLAlchemy DB setup
│   ├── models.py        # Database models (User, Item)
│   ├── schemas.py       # Pydantic schemas for data validation
│   └── routers/
│       ├── users.py     # Auth routes (Register, Login, Me)
│       └── items.py     # CRUD operations for items
├── frontend/
│   ├── index.html       # Main UI structure
│   ├── style.css        # Glassmorphism styling
│   └── app.js           # Frontend logic & API calls
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker configuration
└── docker-compose.yml   # Docker Compose for easy execution
```

## 🛠️ Quickstart (Docker - Recommended)

The easiest way to run the project is using Docker.

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/fastapi-auth-system.git
   cd fastapi-auth-system
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Open your browser and go to: [http://localhost:8000](http://localhost:8000)

## 💻 Local Development (Without Docker)

If you prefer to run it locally without Docker:

1. Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Access the App: [http://localhost:8000](http://localhost:8000)
5. Access the API Docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

## 🔒 API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get JWT token (OAuth2 standard)
- `GET /users/me` - Get current user profile

### Items (CRUD)
- `POST /items/` - Create a new item (Requires Auth)
- `GET /items/` - Get all user items (Requires Auth)
- `GET /items/{id}` - Get a specific item (Requires Auth)
- `PUT /items/{id}` - Update an item (Requires Auth)
- `DELETE /items/{id}` - Delete an item (Requires Auth)

## 🎨 UI Preview

The frontend is served directly by the FastAPI application (`/`). It includes a seamless login/register flow and a dashboard to manage items.

---
*Created as a professional portfolio project.*
