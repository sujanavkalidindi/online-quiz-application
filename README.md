# Quizly — Online Quiz Application

A compact full-stack college mini project built with React, React Router, Express, Node.js and MongoDB Atlas. Quiz definitions, questions and results persist in MongoDB. The public quiz question API omits correct answers; the server scores every submission.

## Project layout

```text
backend/    Express REST API, Mongoose models and demo seed script
frontend/   React + Vite student and demo management UI
postman/    Importable Postman collection
```

## Requirements

- Node.js 18 or later and npm
- A MongoDB Atlas cluster (or a local MongoDB instance)

## Run locally

1. If `backend/.env` does not exist, copy `backend/.env.example` to `backend/.env`. If it already exists, keep its current values and add any missing variables. Set your real Atlas URI on the `MONGODB_URI=` line and choose a private value for `ADMIN_API_KEY` in **`OnlineQuizApp/backend/.env`**. Replace all placeholders; do not commit that file. The repository root `.env.example` is also a placeholder-only template.
2. Install backend dependencies and start the API:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

The API listens on `http://localhost:5000` (or the platform-provided `PORT`). If MongoDB cannot be reached, startup stops with a message pointing to `backend/.env` and common Atlas checks (URI, database credentials and Network Access IP allowlist).
3. In another terminal, seed the demo quizzes:

   ```bash
   cd backend
   npm run seed
   ```

   The seed is safe to run more than once. It adds JavaScript, React and Computer Science quizzes only when the quiz/question set is missing.
4. In another terminal, install and run the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open the URL printed by Vite (usually `http://localhost:5173`). Vite proxies `/api` to `http://localhost:5000` during development.

For a frontend hosted separately from the API, set `VITE_API_URL` to the backend origin when building, for example `VITE_API_URL=https://your-api.example.com`. Set the backend `CLIENT_ORIGIN` to the deployed frontend origin. Multiple allowed origins can be comma separated.

## Pages

- `/` — quiz list, search and category filter
- `/quiz/:id` — instructions and student name
- `/quiz/:id/take` — one-question-at-a-time timed quiz
- `/result/:id` — score and per-question answer review
- `/manage` — demo quiz/question CRUD and recent submissions

The management page is a demo workspace. It requires the `ADMIN_API_KEY` configured in `backend/.env`; enter that key on the management page. The key remains in the current browser session and is sent to protected management API routes in the `x-admin-key` header. Student quiz-taking does not require this key.

## REST API

Successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "message": "..." }`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/quizzes?search=...&category=...` | List published quizzes; includes question count and total marks |
| GET | `/api/quizzes/:id` | Quiz details and aggregate counts |
| POST | `/api/quizzes` | Create quiz: title, description, category, durationMinutes (`x-admin-key`) |
| PUT | `/api/quizzes/:id` | Update quiz fields (`x-admin-key`) |
| DELETE | `/api/quizzes/:id` | Delete quiz and related questions/results (`x-admin-key`) |
| GET | `/api/quizzes/:id/questions` | List quiz questions without correctOption |
| GET | `/api/quizzes/:id/questions/manage` | Protected management view including correctOption for question editing (`x-admin-key`) |
| POST | `/api/quizzes/:id/questions` | Add question with prompt, options (2–6), correctOption (zero based), marks (`x-admin-key`) |
| PUT | `/api/questions/:id` | Edit question fields (`x-admin-key`) |
| DELETE | `/api/questions/:id` | Delete a question (`x-admin-key`) |
| POST | `/api/results` | Submit `{ quizId, studentName, answers: [{ questionId, selectedOption }] }`; score is calculated on the server |
| GET | `/api/results` | List the latest 100 results (`x-admin-key`) |
| GET | `/api/results/:id` | Result details and answer review |

Submissions may omit unanswered questions; duplicate question IDs, invalid question IDs, out-of-range options and client supplied score fields are not used. Correct options are only included in the submitted result review response and result detail endpoint, not in the quiz-taking question endpoint.

Create endpoints return `201`; successful reads/updates/deletes return `200`; malformed input and invalid IDs return `400`; missing records/routes return `404`; invalid management keys return `401`; management routes without a configured key return `503`; database conflicts return `409`; unexpected server errors return `500`.

## Postman

Import `postman/Online-Quiz-API.postman_collection.json`. Set collection variables `baseUrl` to `http://localhost:5000` and `adminKey` to the `ADMIN_API_KEY` value from `backend/.env`. The collection applies the key header to its requests. Create a quiz, add a question and submit a result using the documented request shapes. For result submission, use question IDs returned from the public question endpoint; choose an option index from 0 to option count minus one.

## Deployment

### MongoDB Atlas

Create a database user, allow the backend host in Atlas Network Access, and set `MONGODB_URI` in the backend host's environment. Keep credentials in environment settings, never in source control.

### Express backend

Deploy the `backend` folder to a Node-capable host. Use `npm install` for install and `npm start` for start. Configure `MONGODB_URI`, `ADMIN_API_KEY`, `CLIENT_ORIGIN` and use the host's `PORT`. The server binds to `0.0.0.0`.

### React frontend

Build the `frontend` folder with `npm install` and `npm run build`. Publish `frontend/dist` on a static host and set `VITE_API_URL` at build time to the backend origin. Configure SPA fallback/rewrites so direct navigation and refresh for `/quiz/:id`, `/quiz/:id/take`, `/result/:id` and `/manage` serve `index.html`.

## Validation and known limits

Express/Mongoose validate required fields, lengths, ranges, option counts, correct option indices and IDs. Central middleware returns JSON for unknown routes, invalid IDs and validation/database errors. The timer is a client-side convenience; score correctness is enforced by the backend. Server-side enforcement of elapsed quiz time would require issuing and validating a quiz attempt token, beyond the mini project brief.

## Verification

Run `npm run build` in `frontend` to verify the production bundle. The API requires a reachable MongoDB URI to start or seed. Postman collection requests can be run against the local API after the database is configured.
