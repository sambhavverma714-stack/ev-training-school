# Deployment Guide (GitHub + Render)

This project is a Node.js/Express app that serves both the API and the frontend from one service.

## 1) Local development
1. Install Node.js 18+ (20 recommended).
2. From the project root:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Open `http://localhost:5050`.

On first run the server creates `backend/.env` with random `JWT_SECRET` and `CERT_SECRET` (if missing). It also creates `backend/data/db.json` with seed data (demo admin and lab sessions).

**Demo admin:** `admin@evschool.com` / `Admin123!`

## 2) Push to GitHub
1. Create a new GitHub repository (empty).
2. In this project folder:
   ```bash
   git init            # if not already a git repo
   git add .
   git commit -m "Initial commit - EV Training School"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

**Do not commit secrets or local data.** `.gitignore` already excludes:
- `node_modules/`
- `backend/.env`
- `backend/data/`
- `.DS_Store`

Before pushing, verify with `git status` that `.env` and `db.json` are not staged.

## 3) Deploy on Render (recommended: Blueprint)
### Option A — Blueprint (`render.yaml`) 
1. Push this repo (including `render.yaml`) to GitHub.
2. In Render: **New +** → **Blueprint** → connect the repo.
3. Render will read `render.yaml` (root directory `backend`, build `npm install`, start `npm start`) and create the web service.
4. `JWT_SECRET` and `CERT_SECRET` are generated automatically by the blueprint. You can also set them in Render’s Environment tab.
5. Deploy. Once live, open the Render URL.

### Option B — Manual Web Service
1. In Render: **New +** → **Web Service** → connect the repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Environment variables:
   - `NODE_VERSION` = `20` (recommended)
   - `JWT_SECRET` = (a long random string)
   - `CERT_SECRET` = (a long random string)
   - `PORT` is provided by Render automatically.
4. Create Web Service / Deploy.

## 4) Updating the deployed app (VS Code → GitHub → Render)
- **Edit in VS Code:** changes are local only until you commit and push.
- **Publish changes:** `git add -A && git commit -m "your message" && git push`
- **Render:** if Auto Deploy is enabled (default in `render.yaml`), Render redeploys on push to the connected branch. Otherwise, click **Manual Deploy** in Render.

You do **not** need to copy the project. Work in the same repo (optionally use branches for experiments).

## 5) Important notes for this deployment
- **Ephemeral storage:** this app stores data in `backend/data/db.json`. On Render’s free/ephemeral filesystem, data (users, progress, bookings, certificates) may reset on redeploys or restarts. This is fine for demos/class projects. For persistent production data, migrate to a hosted database.
- **Secrets:** never commit `backend/.env`. Use Render environment variables in production.
- **Health:** the app serves the frontend at `/` and APIs under `/api/*` from the same service.

## 6) Admin panel features
Log in as admin to access Dashboard → **Admin**:
- Create lab sessions (course, lab name, location, date/time, seats)
- View all sessions (booked/capacity, status)
- Delete a session (also cancels its bookings)
- View all student bookings
