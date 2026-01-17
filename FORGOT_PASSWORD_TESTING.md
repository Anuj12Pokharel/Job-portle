# Forgot Password Feature - Testing Guide

This guide will help you test the newly integrated OTP-based password reset functionality.

## Prerequisites

Before testing, ensure:

1. Backend `.env` file has email credentials:
   ```
   EMAIL_USER=singhanzali98@gmail.com
   EMAIL_APP_PASSWORD=wyxe ymwv fboy wdeq
   ```

2. MongoDB is running and connected

3. Backend server is running:
   ```bash
   cd job-backend
   npm run dev
   ```

4. Frontend is running:
   ```bash
   cd vite-project
   npm run dev
   ```

## Test Scenarios

### Jobseeker Password Reset

1. **Navigate to Login**
   - Go to `/Jobseeker-Login`
   - Click "Forgot password?" link

2. **Request OTP**
   - You'll be redirected to `/forgot-password`
   - Enter a registered email address
   - Click "Send OTP"
   - Check your email inbox for the 6-digit OTP

3. **Reset Password**
   - Enter the 6-digit OTP received via email
   - Enter new password (minimum 6 characters)
   - Confirm new password
   - Click "Reset Password"
   - You should see success message and be redirected to login

4. **Login with New Password**
   - Try logging in with the new password
   - Should successfully authenticate

### Employer Password Reset

1. **Navigate to Login**
   - Go to `/Employeer-Login`
   - Click "Forgot password?" link

2. **Request OTP**
   - You'll be redirected to `/forgot-password-employer`
   - Enter your registered company email
   - Click "Send OTP"
   - Check email for OTP

3. **Reset Password**
   - Same process as jobseeker
   - After success, redirects to employer login

## Error Handling Tests

### Invalid Email
- Try requesting OTP with non-existent email
- Should show: "No account found with this email"

### Expired OTP
- Request OTP
- Wait 11 minutes (OTP expires in 10 minutes)
- Try to reset password
- Should show: "OTP has expired. Please request a new one."

### Invalid OTP
- Request OTP
- Enter wrong 6-digit code
- Should show: "Invalid OTP"

### Password Mismatch
- Enter different passwords in "New Password" and "Confirm Password"
- Should show: "Passwords do not match"

### Short Password
- Try password less than 6 characters
- Should show: "Password must be at least 6 characters long"

## API Endpoints

### Jobseeker Endpoints
- `POST /api/auth/forgot-password` - Request OTP
  ```json
  {
    "email": "user@example.com"
  }
  ```

- `POST /api/auth/reset-password` - Reset password
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "newpass123",
    "confirmPassword": "newpass123"
  }
  ```

### Employer Endpoints
- `POST /api/admin/forgot-password` - Request OTP
- `POST /api/admin/reset-password` - Reset password

## Email Template

The OTP email looks like:

```
Subject: Password Reset OTP - Job Portal

Hello [User Name],

You requested to reset your password. Your OTP code is: 123456

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
Job Portal Team
```

## Troubleshooting

### Email Not Sending
1. Check backend console for error messages
2. Verify EMAIL_USER and EMAIL_APP_PASSWORD in `.env`
3. Ensure Gmail app password is correct
4. Check if 2-Step Verification is enabled on Google account

### OTP Not Found
1. Check if user exists in database
2. Verify MongoDB connection
3. Check backend logs for database errors

### Frontend Not Navigating
1. Check browser console for errors
2. Verify routes are configured in `App.tsx`
3. Check `VITE_API_BASE_URL` if using deployed backend

## Success Criteria

✅ User can request OTP via email
✅ OTP is received within 1 minute
✅ OTP successfully validates and resets password
✅ User can login with new password
✅ OTP expires after 10 minutes
✅ Proper error messages for all failure cases
✅ Works for both jobseekers and employers

## Notes

- OTP is hashed before storing in database (using bcrypt)
- OTP fields are not included in regular queries (using `select: false`)
- Each new OTP request overwrites previous OTP
- After successful reset, OTP fields are cleared from database
