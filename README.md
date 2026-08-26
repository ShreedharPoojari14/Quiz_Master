# QuizMaster — Online Quiz Management System

A full-stack, gamified quiz platform. Students take quizzes, earn points, level up,
read lecture material, and compete on a leaderboard. Admins manage categories,
questions, lectures, users, and view all quiz results.

## 1. Technology Stack

**Backend**
- Node.js + Express
- SQLite via `better-sqlite3` (zero-config, file-based database — no separate DB server needed)
- JWT authentication (`jsonwebtoken`) + `bcryptjs` for password hashing
- `express-validator` for input validation

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Axios for API calls
- lucide-react for icons

## 2. Project Structure

```
quizmaster/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── db.js                  # SQLite schema + seed data
│   ├── middleware/auth.js     # JWT auth + admin guard middleware
│   ├── routes/                # auth, categories, questions, quiz, results,
│   │                          # users, dashboard, contact, leaderboard, lectures
│   ├── data/                  # quizmaster.db is created here on first run
│   └── .env                   # PORT, JWT_SECRET, JWT_EXPIRES_IN
│
└── frontend/
    ├── src/
    │   ├── api/axios.js       # Axios instance with auth token interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/        # Navbar, Footer, AdminLayout, route guards, etc.
    │   ├── pages/              # Home, Login, Register, Categories, Quiz, Result,
    │   │                       # StudentDashboard, Leaderboard, Lectures, Profile...
    │   └── pages/admin/        # AdminDashboard, AdminCategories, AdminQuestions,
    │                           # AddQuestion, AdminResults, AdminUsers, AdminLectures
    └── .env                    # VITE_API_URL
```

## 3. Major Features

- **Auth**: register/login with JWT, protected routes, role-based access (student/admin)
- **Categories & Questions**: browse categories, admin CRUD for both
- **Quiz taking**: 10 random questions per attempt, per-question timer countdown,
  previous/next navigation, progress bar, auto-submit when time runs out,
  answers persisted to `sessionStorage` so a refresh doesn't lose progress
- **Results**: instant scoring, correct/wrong/skipped breakdown, review answers,
  full result history for students, searchable/filterable results for admins
- **Gamification**: points per correct answer and per completed lecture,
  levels, badges (Bronze/Silver/Gold/Platinum), leaderboard
- **Lectures**: simple reading material students can mark complete for points
- **Admin dashboard**: platform-wide stats, user management (promote/demote/delete),
  category and question management, results search
- **Contact form**: stored server-side
- **Responsive design** throughout, with empty/error/loading states on every page

## 4. Assumptions Made

- No external email service is configured — contact messages are stored in the
  database (`contact_messages` table) rather than emailed.
- "Forgot Password" is shown in the UI but not wired up (no email service available);
  a logged-in user can change their password from the Profile page instead.
- Gamification (points, levels, badges, leaderboard, lectures) was implied by the
  project description but not shown in the screenshots, so reasonable point
  values and thresholds were chosen (10 pts/correct answer, 10 pts/lecture,
  100 pts per level).
- SQLite was chosen over Postgres/MongoDB for zero-config local setup — swap
  `better-sqlite3` for another driver in `db.js` if you need a client-server DB.

## 5. How to Run It (from a fresh terminal)

### Prerequisites
- Node.js 18+ and npm installed
- Internet access for the one-time `npm install` (this project's dependencies
  are not pre-installed)

### Step 1 — Install backend dependencies
```bash
cd quizmaster/backend
npm install
```

### Step 2 — Configure environment variables
A working `.env` is already included for local development. To customize it:
```bash
cp .env.example .env
# then edit JWT_SECRET, PORT as needed
```

### Step 3 — Start the backend
```bash
npm start
```
This automatically creates and seeds `backend/data/quizmaster.db` on first run
(SQLite — no separate database server to start). The API runs at
`http://localhost:5000`.

**Seeded demo accounts:**
| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@quizmaster.com   | admin123    |
| Student | john@quizmaster.com    | student123  |
| Student | jane@quizmaster.com    | student123  |

### Step 4 — Install frontend dependencies (in a new terminal)
```bash
cd quizmaster/frontend
npm install
```

### Step 5 — Configure frontend environment
Already included as `.env` (points to `http://localhost:5000/api`). Copy from
`.env.example` if you need to change it.

### Step 6 — Start the frontend
```bash
npm run dev
```

### Step 7 — Open the website
Visit **http://localhost:5173** in your browser. The Vite dev server proxies
`/api` requests to the backend, so both must be running.

## 6. Building for Production

```bash
cd frontend
npm run build       # outputs static files to frontend/dist
npm run preview      # preview the production build locally
```
Serve `frontend/dist` with any static host (Netlify, Vercel, nginx, etc.), and
deploy `backend/` to any Node host (Render, Railway, a VPS, etc.) — just set
`JWT_SECRET` to a strong secret and update `VITE_API_URL` to point at the
deployed backend URL before building.

## 7. Notes on Robustness

- All forms validate input client-side and server-side (express-validator);
  errors surface as inline alerts, never silent failures.
- 401 responses automatically clear the stored session and redirect to `/login`.
- Empty states are shown wherever a list could be empty (no categories, no
  results, no lectures, no users).
- Quiz progress is saved to `sessionStorage` per category, so a refresh mid-quiz
  restores the timer and answers instead of losing them.
- Admins cannot delete or demote their own account from the Users page.
- A catch-all 404 page handles unknown routes.
