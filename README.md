# MongoDB DevOps Demo

A small, production-*like* full-stack app for learning DevOps and MongoDB
concepts — how a Node.js backend talks to MongoDB via Mongoose, and how the
application behaves when the database becomes unavailable.

This is intentionally **not** a large application. No auth, no Docker, no
Kubernetes, no TypeScript. Just enough moving parts to observe real
connection behavior, environment configuration, and failure handling.

## Stack

- **Frontend:** React (Vite), Axios, plain CSS (glassmorphism dark theme)
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (standalone or replica set)

## Project Structure

```
mongo-db-projects/
├── backend/
│   ├── server.js                 # entry point
│   ├── .env.example
│   └── src/
│       ├── app.js                # express app + route wiring
│       ├── config/               # env config, mongoose connection (retry logic)
│       ├── models/                # User schema
│       ├── controllers/           # request handlers
│       ├── routes/                # route definitions
│       ├── services/              # data access layer
│       ├── middleware/            # request logger, error handler
│       └── utils/                 # in-memory log store, mongo URI sanitizer
├── frontend/
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.jsx / App.jsx
│       ├── api/                   # axios instance + endpoint calls
│       ├── components/            # Navbar, EnvCard, InsertForm, UsersTable,
│       │                          # HealthCard, LogsWindow, ConnectionBanner
│       ├── hooks/                 # usePolling
│       └── styles/                # global glassmorphism CSS
├── ecosystem.config.js            # PM2 config (runs both apps)
├── package.json                   # root — just the PM2 dependency + scripts
└── README.md
```

## API Endpoints

| Method | Endpoint       | Description                          |
|--------|----------------|---------------------------------------|
| GET    | `/health`      | Backend + MongoDB health snapshot     |
| GET    | `/env`         | Sanitized environment variables       |
| GET    | `/users`       | List all users                        |
| POST   | `/users`       | Create a user (`{ name, email }`)     |
| DELETE | `/users/:id`   | Delete a user by id                   |
| GET    | `/logs`        | Recent server activity log (bonus)    |

`GET /logs` is an addition beyond the original spec — it lets the frontend
"Application Logs" panel show real backend/database events (connects,
disconnects, request activity) rather than just client-side guesses.

## Setup & Run

### 1. MongoDB

Any of these work — that's the point of the demo:

```bash
# Standalone (quickest)
docker run -d -p 27017:27017 --name mongo-standalone mongo:7

# or a local `mongod` install, or a MongoDB Atlas connection string,
# or a local replica set for failover testing
```

> Docker is only suggested here as an easy way to get a MongoDB *server*
> running — the application itself has no Docker dependency.

### 2. Backend

```bash
cd backend
cp .env.example .env    # edit MONGO_URI etc. if needed
npm install
npm start                # or: npm run dev (nodemon)
```

Backend runs on `http://localhost:5000` by default.

### 3. Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL should point at the backend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default (Vite dev server).

### Alternative: run both with PM2

Once you've done `npm install` in both `backend/` and `frontend/` (and copied
their `.env` files), you can manage both processes together with
[PM2](https://pm2.keymetrics.io/) instead of two terminal tabs:

```bash
# from the repo root
npm install                # installs pm2 locally as a devDependency
npm run pm2:start          # starts both backend + frontend under pm2

npm run pm2:status         # see status/uptime/restarts for both apps
npm run pm2:logs           # tail combined logs (Ctrl+C to stop tailing)
npm run pm2:restart        # restart both
npm run pm2:stop           # stop both, keep them registered
npm run pm2:delete         # stop and remove both from pm2's process list
```

`ecosystem.config.js` at the repo root defines both apps:

- `devops-demo-backend` → `node server.js` inside `backend/`
- `devops-demo-frontend` → `npm run dev` (Vite) inside `frontend/`

This is a nice way to see DevOps concepts in action on the backend itself,
not just MongoDB: PM2 auto-restarts the backend if it crashes (`autorestart:
true`), and `pm2 status` shows the restart count — try `kill -9 <backend
pid>` while it's running under PM2 and watch it come back on its own.

If you'd rather run pm2 globally instead of via `npx`, `npm install -g pm2`
and drop the `npm run` prefix in favor of `pm2 start ecosystem.config.js`
directly from the repo root.

## Environment Variables (backend/.env)

| Variable      | Example                                     | Notes                                   |
|---------------|----------------------------------------------|------------------------------------------|
| `PORT`        | `5000`                                       | Backend port                             |
| `MONGO_URI`   | `mongodb://localhost:27017/devops_demo`      | Full connection string (kept server-side)|
| `NODE_ENV`    | `development` / `staging` / `production`     | Shown in navbar                          |
| `APP_NAME`    | `MongoDB DevOps Demo`                        | Shown in navbar                          |
| `SERVER_NAME` | `api-node-1`                                 | Useful when running multiple instances   |
| `VERSION`     | `1.0.0`                                      | App/build version                        |
| `AWS_REGION`  | `ap-south-1`                                 | Example cloud metadata                   |

The `/env` API only ever returns the **hostname and database name** portion
of `MONGO_URI` — credentials are stripped server-side and never sent to the
browser.

## What This Demonstrates

- **Environment-driven configuration** — everything in `backend/.env`,
  loaded via `dotenv`, surfaced (safely) through `GET /env`.
- **MongoDB connection lifecycle** — `mongoose.connection` event listeners
  (`connected`, `disconnected`, `error`, `reconnected`) drive both the health
  endpoint and the activity log.
- **Automatic retry** — if MongoDB is unreachable at startup or drops mid-run,
  the backend retries the connection every 5 seconds until it succeeds
  (`backend/src/config/db.js`).
- **Graceful degradation** — with Mongoose buffering disabled
  (`bufferCommands: false`), API calls fail fast with a clear `503` message
  instead of hanging when the database is down. The frontend disables the
  insert form and shows a red banner in that state.
- **Standalone vs. Replica Set vs. Failover** — point `MONGO_URI` at a
  standalone `mongod`, a replica set (`mongodb://host1,host2,host3/db?replicaSet=rs0`),
  or Atlas, and watch how the health/connection UI reacts to a primary
  stepping down or a node being killed.

## Suggested Failure Experiments

1. Start everything normally, insert a couple of users.
2. Stop the MongoDB container/process — watch the navbar go red, the banner
   appear, the submit button disable, and `Database Error` / connection-lost
   entries show up in the log window.
3. Start MongoDB again — within a few seconds the backend reconnects
   automatically and the UI recovers, no restart required.
4. For replica sets: kill the primary node and observe how the driver fails
   over to a new primary, and how that shows up in health/logs.
5. If running under PM2: `kill -9 <backend pid>` (get the pid from
   `pm2 status`) and watch PM2 bring the backend back up automatically —
   `pm2 status` shows the restart counter tick up, and the dashboard recovers
   once the process is back and reconnects to MongoDB.
