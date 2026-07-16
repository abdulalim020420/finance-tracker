# Finance Tracker

A full-stack personal finance management application built with Laravel 12 and React.

🔗 **Live Demo:** https://finance-tracker-one-beige-25.vercel.app 
📦 **Backend API:** https://finance-tracker-api-59io.onrender.com

🚨 **Important Disclaimer:** Backend hosted on Render free tier — first load may take 30 seconds to wake up.
---

## Features

- JWT Authentication (Laravel Sanctum)
- Income & Expense transaction tracking
- Custom categories with icons and colors
- Dashboard with analytics and charts
- Monthly financial overview
- Redis caching for dashboard performance
- Responsive design (Mobile responsive in progress)

---

## Tech Stack

### Backend
- **Laravel 13** — PHP framework
- **PostgreSQL** — Primary database
- **Redis** — Caching layer
- **Laravel Sanctum** — API authentication
- **Nginx + PHP-FPM** — Production web server
- **Docker** — Containerization

### Frontend
- **React 19** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Recharts** — Data visualization
- **Axios** — HTTP client
- **React Router** — Client-side routing

### Infrastructure
- **Render** — Backend hosting
- **Vercel** — Frontend hosting
- **Neon** — Serverless PostgreSQL
- **Upstash** — Serverless Redis

---

## Architecture

This project follows a **Modular Monolith** architecture with **Clean Architecture** principles:

```
Modules/
├── Auth/           # Authentication (register, login, logout)
├── Category/       # Category management with Repository pattern
├── Transaction/    # Transaction management with filters & pagination
├── Dashboard/      # Analytics with Redis caching
└── Shared/         # Shared response format
```

Each module contains:
- **Controller** — HTTP request/response handling
- **Service** — Business logic
- **Repository** — Database queries (Category & Transaction)
- **Requests** — Validation

---

## Local Development

### Prerequisites
- Docker Desktop
- WSL2 (Windows)

### Setup

1. Clone the repository
```bash
git clone https://github.com/abdulalim020420/finance-tracker.git
cd finance-tracker
```

2. Copy environment file
```bash
cp backend/.env.example backend/.env
```

3. Update `backend/.env` with your database credentials

4. Start all services
```bash
docker compose up -d
```

5. Run migrations
```bash
docker exec -it finance_app php artisan migrate
```

6. Access the app
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- CloudBeaver: http://localhost:8978

---

## API Endpoints

### Auth
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### Categories
```
GET    /api/v1/categories
POST   /api/v1/categories
PUT    /api/v1/categories/{id}
DELETE /api/v1/categories/{id}
```

### Transactions
```
GET    /api/v1/transactions
POST   /api/v1/transactions
PUT    /api/v1/transactions/{id}
DELETE /api/v1/transactions/{id}
```

### Dashboard
```
GET    /api/v1/dashboard/summary?month=2026-07
```

---

## Key Implementation Highlights

- **Modular Monolith** — Self-contained modules for scalability
- **Repository Pattern** — Database abstraction with interfaces (SOLID)
- **Redis Caching** — Dashboard queries cached for 5 minutes, invalidated on data change
- **SQL Indexing** — Optimized queries on `user_id`, `date`, `category_id`
- **Docker** — Full containerized development environment
- **CI/CD** — Auto deployment via GitHub → Render/Vercel

---

## Author

**Abdul Alim Abdulamirudin**
- GitHub: [@abdulalim020420](https://github.com/abdulalim020420)
- LinkedIn: [linkedin.com/in/abdul-alim-abdulamirudin-927861299](https://linkedin.com/in/abdul-alim-abdulamirudin-927861299)