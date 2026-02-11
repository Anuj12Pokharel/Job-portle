# Image Display Issue Fix - Local vs Server

## Problem
Images display correctly locally but not on the production server.

## Root Cause
The nginx configuration in the frontend container was trying to serve uploads from `/app/uploads/`, but:
1. Uploads are stored in the **backend container** at `/app/uploads`
2. The frontend container doesn't have access to the backend's upload files
3. Docker containers are isolated - they don't share filesystems by default

## Solution Implemented

### 1. **Updated Nginx Configuration** (`vite-project/nginx-ssl.conf`)
Changed the `/uploads/` location block from serving static files to proxying requests to the backend:

**Before:**
```nginx
location /uploads/ {
    alias /app/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**After:**
```nginx
location /uploads/ {
    proxy_pass http://job-portal-backend:5000/uploads/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 2. **Fixed Backend Server Configuration** (`job-backend/server.ts`)
Updated the uploads path to use the correct location after TypeScript compilation:

**Before:**
```typescript
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

**After:**
```typescript
// Serve static files from uploads directory
// Use absolute path to ensure it works in both dev and production
const uploadsPath = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));

// Log uploads path for debugging
console.log("Serving uploads from:", uploadsPath);
```

## Why This Works

1. **Nginx Proxying**: All `/uploads/*` requests are now forwarded to the backend server
2. **Backend Serves Files**: The backend Express server handles serving the actual files from `/app/uploads`
3. **Volume Persistence**: The docker-compose.yml already maps `./job-backend/uploads:/app/uploads` ensuring files persist

## File Structure in Production

```
Backend Container (/app):
├── dist/
│   └── server.js (compiled TypeScript)
├── uploads/           <-- Uploaded files stored here
│   ├── trainings/
│   ├── banners/
│   ├── resumes/
│   └── ...
├── models/
├── controller/
└── ...
```

## How Image URLs Work Now

1. **Frontend Request**: `https://joblink360.com/uploads/trainings/training-123.jpg`
2. **Nginx**: Receives request, matches `/uploads/` location
3. **Proxy**: Forwards to `http://job-portal-backend:5000/uploads/trainings/training-123.jpg`
4. **Backend**: Express serves the file from `/app/uploads/trainings/training-123.jpg`
5. **Response**: Image is sent back through nginx to the client

## Deployment Steps

### 1. Rebuild and Restart
```bash
cd /path/to/project
docker-compose down
docker-compose up -d --build
```

### 2. Verify Uploads Directory
```bash
# Check backend container
docker exec job-portal-backend ls -la /app/uploads

# You should see:
# trainings/
# banners/
# resumes/
# etc.
```

### 3. Check Logs
```bash
# Backend logs should show:
docker logs job-portal-backend

# Look for: "Serving uploads from: /app/uploads"
```

### 4. Test Image Access
```bash
# Test backend directly
curl http://localhost:5000/uploads/trainings/[filename]

# Test through nginx
curl https://joblink360.com/uploads/trainings/[filename]
```

## Common Issues and Solutions

### Issue 1: 404 Not Found
**Problem**: Images still return 404
**Solution**: 
```bash
# Check if files exist in backend container
docker exec job-portal-backend find /app/uploads -type f

# Check backend logs
docker logs job-portal-backend | grep uploads
```

### Issue 2: Permission Denied
**Problem**: Backend can't read files
**Solution**:
```bash
# Fix permissions in backend container
docker exec job-portal-backend chmod -R 755 /app/uploads
```

### Issue 3: Empty Uploads Folder
**Problem**: Uploads folder is empty after restart
**Solution**: Ensure volume mapping in docker-compose.yml:
```yaml
volumes:
  - ./job-backend/uploads:/app/uploads
```

### Issue 4: CORS Error
**Problem**: Images blocked by CORS
**Solution**: Backend already has CORS enabled in server.ts

## Files Modified
- `vite-project/nginx-ssl.conf` - Updated uploads location block
- `job-backend/server.ts` - Fixed uploads path
- `job-backend/Dockerfile` - Already creates uploads directory (no change needed)
- `docker-compose.yml` - Already has volume mapping (no change needed)

## Testing Checklist

- [ ] Upload a new training image through admin panel
- [ ] Verify image displays on training page
- [ ] Check browser console for errors
- [ ] Test direct URL: `https://joblink360.com/uploads/[path]/[filename]`
- [ ] Verify images persist after container restart
- [ ] Test banner upload and display
- [ ] Test profile picture upload
- [ ] Check all existing images still work

## Monitoring

Add to your monitoring to track upload issues:
```bash
# Check uploads folder size
docker exec job-portal-backend du -sh /app/uploads

# Watch backend logs for upload errors
docker logs -f job-portal-backend | grep -i "upload\|error"

# Check nginx access logs for /uploads requests
docker exec job-portal-frontend tail -f /var/log/nginx/access.log | grep uploads
```

## Future Improvements (Optional)

1. **CDN Integration**: Use AWS S3/CloudFront or similar for better performance
2. **Image Optimization**: Add image compression before upload
3. **Backup Strategy**: Regularly backup uploads folder
4. **Storage Limit**: Implement max upload size per user/admin
