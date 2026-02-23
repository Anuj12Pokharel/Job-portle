# Job-portle

This repository contains two projects:

- `job-backend` — Express/MongoDB backend API
- `vite-project` — Vite + React frontend

Quick start (development):

1. Start backend (from `job-backend`):

```bash
cd job-backend
running services 
npm install
npm run dev
```

2. Start frontend (from `vite-project`):

```bash
cd vite-project
npm install
npm run dev
```

Integrate/build for production (serve frontend from backend):

From the `job-backend` folder run:

```bash
npm run build-client
npm start
```

This builds the frontend into `vite-project/dist` and the backend will serve those static files automatically if present.

Notes:
- API routes are under `/api/*` and static uploads are served from `/uploads`.
- For deployment platforms like Heroku, the `heroku-postbuild` script will build the frontend automatically.

Environment variables

- Create a `.env` file in `job-backend/` with the following variables (example):

```
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

- `job-backend/.env` is ignored by git by default; do NOT commit secrets to source control.
- For detailed email setup instructions, see `job-backend/ENV_SETUP.md`

## Features

### Password Reset Flow

The application includes OTP-based password reset functionality:

1. **Jobseeker**: Click "Forgot password?" on login page → Enter email → Receive 6-digit OTP → Enter OTP and new password
2. **Employer**: Same flow from employer login page

- OTP expires in 10 minutes
- Uses Gmail SMTP for sending emails
- Routes:
  - `/forgot-password` - Jobseeker password reset
  - `/forgot-password-employer` - Employer password reset
