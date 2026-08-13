# E-Cell MRCET Deployment Guide

This guide provides step-by-step instructions for deploying both the **frontend client** and the **backend API server** to production.

---

## 1. Backend Server Deployment

The backend is built with Express.js and Sequelize. By default, it connects to a **PostgreSQL database** if connection strings are provided; otherwise, it falls back to a local **SQLite database** (`database.sqlite`).

### Environment Variables
Configure these environment variables on your hosting provider (e.g. Render, Railway, Fly.io, or VPS):

| Variable | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (Neon, Supabase, etc.) | *None (falls back to SQLite)* | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for signing admin authentication tokens | `fallback_secret_key_123` | `your_long_secure_random_string_here` |
| `ADMIN_PASSWORD` | Seed password for the master admin account (`master@admin.com`) | `admin123` | `securepassword987` |
| `FRONTEND_URL` | URL of the frontend for CORS policy configurations | *Allow localhost* | `https://e-cell-mrcet.vercel.app` |
| `PORT` | Listening port for the express server | `5000` | `8080` |

### Critical Requirement: Persistent Local Disk Storage
Because uploaded gallery images, event posters, and member resumes are stored locally in the `server/uploads/` directory, **you must configure a persistent volume/disk** on your server hosting provider to prevent files from being lost when the server restarts or re-deploys.

- **Render**: Add a **Disk** under your Web Service Settings.
  - Mount Path: `/opt/render/project/src/server/uploads` (or relative path to your workspace directory `server/uploads`).
- **Railway**: Add a **Volume** to your service.
  - Mount Path: `/app/server/uploads`
- **Docker / VPS**: Bind a host volume:
  - `-v /var/data/ecell_uploads:/app/server/uploads`

---

## 2. Complete Frontend Deployment: Git to Vercel

Follow these step-by-step instructions to push your repository to Git and deploy the frontend client onto Vercel.

### Step 1: Push Code to GitHub
Copy, modify (update username), and run the following block in your terminal (run from the project root `d:\ECELL`):

```bash
git init
git add .
git commit -m "feat: complete admin layout, local storage upload, and eureka fixes"
git branch -M main
# REPLACE "your-username" WITH YOUR GITHUB USERNAME BEFORE RUNNING:
git remote add origin https://github.com/your-username/ecell-mrcet.git
git push -u origin main
```

### Step 2: Deploy the Backend Server (First)
Before deploying the frontend, deploy the backend server (e.g., to Render or Railway) as detailed in **Section 1**. 
Once the backend is online, copy the live URL (e.g., `https://ecell-backend.onrender.com`).

### Step 3: Create Vercel Project
1. Log in to the [Vercel Dashboard](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Select your git provider and import the `ecell-mrcet` repository you created in Step 1.

### Step 4: Configure Vercel Project Settings
In the configuration screen, set the following:
1. **Framework Preset**: Select **Vite** (Vercel should auto-detect this).
2. **Root Directory**: Keep as `./` (project root).
3. **Build & Development Settings**:
   - Build Command: `npm run build` (or override to `vite build`)
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Environment Variables**:
   - Add a new environment variable:
     - **Key**: `VITE_API_URL`
     - **Value**: Your live backend URL (e.g., `https://ecell-backend.onrender.com`)
   - Click **Add**.

### Step 5: Deploy
1. Click the **Deploy** button.
2. Vercel will clone your GitHub repository, install dependencies, compile the Vite application, and output the optimized static build.
3. Once completed, Vercel will provide you with a live domain (e.g., `https://ecell-mrcet.vercel.app`).

### Step 6: Configure React Router Redirects
The project includes a [vercel.json](file:///d:/ECELL/vercel.json) at the root:
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Vercel automatically picks up this file to handle client-side routing. Any path (like `/eureka` or admin sections) will properly route to `index.html` without triggering 404 page-load errors.

---

## 3. Post-Deployment Verification

1. Go to your Vercel website URL (e.g., `https://ecell-mrcet.vercel.app`).
2. Verify all sections load, navigation works, and the custom cursor operates smoothly.
3. Test **Contact Form Submission** on the frontend -> open your backend server logs to verify it was received.
4. Press `Ctrl + Shift + A` on the homepage to open the Admin authentication overlay.
5. Log in using `master@admin.com` and your backend's configured `ADMIN_PASSWORD`.
6. Navigate to the **Gallery** tab:
   - Upload a test photo.
   - Confirm it appears in the gallery grid instantly and remains present after a browser refresh.
7. Navigate to the public Gallery page to confirm the new image displays there as well.
