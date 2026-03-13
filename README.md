# JobBoard — Full Stack Job Listing Platform

A full stack job board application built with **Symfony 7** (REST API) and **Next.js 15** (Frontend), designed to connect developers with tech companies across Spain.

---

## Tech Stack

**Backend**
- PHP 8.2 + Symfony 7
- Doctrine ORM + PostgreSQL
- LexikJWT Authentication
- NelmioCors Bundle

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS

---

## Project Structure
```
job-board/
├── api/         ← Symfony REST API
└── frontend/    ← Next.js Frontend
```

---

## Architecture Decisions

### Backend (Symfony)

**Service Layer** — Business logic is extracted into `JobService` instead of living in controllers. This keeps controllers thin and logic reusable across multiple endpoints.

**Repository Pattern** — Custom repository methods like `findByFilters()` and `findDistinctLocations()` encapsulate database queries using Doctrine's QueryBuilder, keeping SQL out of controllers.

**Validation Trait** — `ValidationTrait` extracts repeated validation error formatting into a reusable trait, following the DRY principle.

**Enums** — `JobStatus` uses PHP 8.1 backed enums instead of plain strings, ensuring only valid status values can be stored in the database.

**toArray()** — Each entity has a `toArray()` method to centralize JSON serialization, avoiding repeated data mapping across multiple controller methods.

**JWT Authentication** — Stateless authentication using JSON Web Tokens. The server never stores sessions — it simply signs and verifies tokens using asymmetric RSA keys.

### Frontend (Next.js)

**Server Components by default** — Data fetching happens on the server where possible (job listings, job detail, homepage stats), reducing JavaScript sent to the browser and improving performance.

**Client Components only when needed** — Components like `SearchBar` and forms use `'use client'` only because they require interactivity (`useState`, `onChange`).

**HTTP-only cookies** — JWT tokens are stored in HTTP-only cookies set by Next.js API routes, preventing XSS attacks from stealing tokens via JavaScript.

**Next.js API Routes as middleware** — Instead of calling Symfony directly from the browser (CORS issues, token exposure), sensitive requests go through Next.js API routes which attach the token server-side.

**Reusable components** — `Navbar`, `Footer`, `JobCard`, and `Button` are shared components used across all pages, avoiding duplication.

---

## Features

- Browse job listings with pagination
- Filter jobs by city and status in real time
- View job detail pages
- Register and login with JWT authentication
- Post a job (protected — requires login)
- Automatic redirect to login for protected pages

---

## Getting Started

### Requirements
- PHP 8.2+
- Composer
- Symfony CLI
- Node.js 18+
- PostgreSQL

### Backend Setup
```bash
cd api
composer install
```

Copy `.env` and configure your database:
```env
DATABASE_URL="postgresql://user:password@127.0.0.1:5432/job_board"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your_passphrase
```

Then run:
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
php bin/console lexik:jwt:generate-keypair
symfony server:start
```

API will be available at `http://127.0.0.1:8000`

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then run:
```bash
npm run dev
```
---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | No | Register a new user |
| POST | `/api/login` | No | Login and get JWT token |
| GET | `/api/jobs` | No | List jobs (pagination + filtering) |
| GET | `/api/jobs/{id}` | No | Get job detail |
| POST | `/api/jobs` | Yes | Create a job |
| PUT | `/api/jobs/{id}` | Yes | Update a job |
| DELETE | `/api/jobs/{id}` | Yes | Delete a job |
| GET | `/api/jobs/locations` | No | Get distinct locations |
| GET | `/api/companies` | No | List companies |
| POST | `/api/companies` | Yes | Create a company |

