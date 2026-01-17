# Quick Fix for Server Errors

## Issues Found:

1. ❌ **MONGO_URI is empty** in `.env` file
2. ✅ Email credentials are set correctly
3. ✅ nodemailer is installed

## Fix Steps:

### 1. Update your `.env` file

Open `job-backend/.env` and update it with these values:

```env
# MongoDB Connection - REPLACE WITH YOUR ACTUAL MONGODB URI
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/job-portal?retryWrites=true&w=majority

# OR for local MongoDB:
# MONGO_URI=mongodb://localhost:27017/job-portal

# JWT Secret for authentication tokens
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration for OTP/Password Reset (already set)
EMAIL_USER=singhanzali98@gmail.com
EMAIL_APP_PASSWORD=wyxe ymwv fboy wdeq

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Get your MongoDB URI:

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://cloud.mongodb.com
2. Sign in/create account
3. Create a cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `job-portal`

**Option B: Local MongoDB**
1. Install MongoDB Community Edition on your machine
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/job-portal`

### 3. Restart your backend server

After updating `.env`:

```bash
cd job-backend
npm run dev
```

## Expected Success Output:

```
Email credentials are set ✓
MongoDB connected ✓
Server running on port 5000 ✓
```

## Troubleshooting:

### If you still see "Cannot find module 'nodemailer'":
```bash
cd job-backend
npm install
npm run dev
```

### If MongoDB connection fails:
- Check your MONGO_URI is correct
- If using Atlas, whitelist your IP address (0.0.0.0/0 for all IPs)
- Ensure MongoDB service is running (if local)

### If path-to-regexp error persists:
This error was likely caused by the empty MONGO_URI. Once you add a valid MONGO_URI, the server should start properly.
