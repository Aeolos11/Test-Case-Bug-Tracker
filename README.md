# Test Case & Bug Tracker



## Features

- **Authentication** — JWT-based register/login, 24h token expiry
- **Projects** — full CRUD, with an owner and a list of members
- **Project membership** — add or remove members by email (resolved to user accounts server-side); access to a project's test cases requires being the owner or a member
- **Test cases** — full CRUD with title, description, status (`pending` / `passed` / `failed` / `blocked`), priority (`low` / `medium` / `high` / `critical`), expected result, and an ordered list of steps (each with its own action and expected result)
- **Access control** — every project and test case endpoint checks ownership/membership before allowing reads, writes, or deletes
- **Dockerized** — backend, frontend, and Nginx are each containerized; `docker compose up --build` runs the whole stack with one command
- **CI** — GitHub Actions verifies that both Docker images build successfully on every push
- **API test suite** — a Postman collection with automated `pm.test()` assertions covering every endpoint, including success and error paths

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose), hosted on Atlas |
| Auth | JWT, bcrypt |
| Infra | Docker, Docker Compose, Nginx |
| CI | GitHub Actions |
| API testing | Postman |

## Project structure

```
TestCaseBugTracker/
├── backend/            # Express API
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers (auth, project, testCase)
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas (User, Project, TestCase)
│   ├── routes/         # Express routers
│   ├── app.js          # Entry point
│   └── Dockerfile
├── frontend/           # React (Vite) SPA
│   ├── src/
│   │   ├── pages/      # LoginPage, RegisterPage, ProjectPage, ProjectDetailPage
│   │   └── ...
│   ├── nginx.conf      # SPA routing + /api reverse proxy
│   └── Dockerfile      # Multi-stage build (Node → Nginx)
├── postman/            # API test collection
├── .github/workflows/  # CI pipeline
└── docker-compose.yml
```

## Getting started

### Option 1 — Docker (recommended)

Requires Docker and Docker Compose.

1. Create `backend/.env` with:
   ```
   MONGO_URI=<your MongoDB connection string>
   JWT_SECRET=<any secret string>
   ```
2. From the repo root:
   ```bash
   docker compose up --build
   ```
3. Open the app at **http://localhost:5173**. The API is reachable at `http://localhost:3000` directly, or via `/api/...` through the frontend's Nginx proxy.

### Option 2 — Run locally without Docker

**Backend**
```bash
cd backend
npm install
# create .env with MONGO_URI and JWT_SECRET, as above
node app.js
```
Runs on `http://localhost:3000`.

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` with a Vite dev proxy forwarding `/api` to the backend.

## API overview

All endpoints except register/login/current-user require a valid JWT (`Authorization: Bearer <token>`).

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Create a user account |
| POST | `/api/login` | Authenticate, receive a JWT |
| GET | `/api/current-user` | Get the logged-in user's info |
| POST | `/api/create-project` | Create a project |
| GET | `/api/projects` | List projects the user owns or is a member of |
| GET | `/api/projects/:id` | Get a single project (members populated with email) |
| PUT | `/api/projects/:id` | Update a project (name, description, members by email) |
| DELETE | `/api/projects/:id` | Delete a project and its test cases (owner only) |
| POST | `/api/projects/:projectId/create-testcase` | Create a test case in a project |
| GET | `/api/projects/:projectId/testcases` | List a project's test cases |
| GET | `/api/testcases/:id` | Get a single test case |
| PUT | `/api/testcases/:id` | Update a test case |
| DELETE | `/api/testcases/:id` | Delete a test case (owner only) |

## Testing

An automated Postman collection lives in [`postman/`](./postman), with `pm.test()` assertions for every endpoint — covering both successful requests and expected error responses (invalid input, missing permissions, nonexistent resources).

## CI/CD

A GitHub Actions workflow ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs on every push: it checks out the repository, reconstructs the `.env` file from GitHub Secrets, and runs `docker compose up --build` to confirm both the backend and frontend images build and start successfully.

# Test-Case-Bug-Tracker