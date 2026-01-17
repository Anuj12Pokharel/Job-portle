# Environment Variables Setup

This file documents all required environment variables for the Job Portal backend.

## Required Environment Variables

Create a `.env` file in the `job-backend` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/job-portal

# JWT Secret for authentication tokens
JWT_SECRET=your_jwt_secret_here

# Email Configuration for OTP/Password Reset
# Use Gmail SMTP with app password
EMAIL_USER=singhanzali98@gmail.com
EMAIL_APP_PASSWORD=wyxe ymwv fboy wdeq

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Email Setup Instructions

The application uses Gmail SMTP to send OTP emails for password reset functionality.

### How to get Gmail App Password:

1. Enable 2-Step Verification on your Google Account
2. Go to Google Account Settings → Security
3. Under "2-Step Verification", click on "App passwords"
4. Generate a new app password for "Mail"
5. Copy the generated password and use it as `EMAIL_APP_PASSWORD`

### Current Configuration:

The provided credentials are:
- **Email**: singhanzali98@gmail.com
- **App Password**: wyxe ymwv fboy wdeq

## Testing Password Reset Flow

1. User clicks "Forgot Password" on login page
2. User enters their email address
3. System generates 6-digit OTP and sends to email
4. User enters OTP and new password
5. Password is updated and user can login with new credentials

OTP expires in 10 minutes.
