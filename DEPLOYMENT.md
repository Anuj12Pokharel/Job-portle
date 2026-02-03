# Job Portal Docker Deployment Guide

## Quick Start (One-Click Deployment)

### Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

### Windows Deployment

1. **Clone the repository** (if not already done)
2. **Run the deployment script:**
   ```cmd
   deploy.bat
   ```

### Linux/Mac Deployment

1. **Clone the repository** (if not already done)
2. **Make the script executable:**
   ```bash
   chmod +x deploy.sh
   ```
3. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

## Manual Deployment Steps

### 1. Environment Configuration

Copy the production environment template:
```bash
cp .env.production .env
```

Edit `.env` and update the following:
- `MONGO_ROOT_PASSWORD`: Strong password for MongoDB
- `JWT_SECRET`: Random 32+ character string
- `EMAIL_USER`: Your email for notifications
- `EMAIL_PASS`: App-specific password
- `FRONTEND_URL`: Your production domain
- `VITE_API_BASE_URL`: Your API endpoint

### 2. Build and Start Services

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Verify Deployment

Check if all services are running:
```bash
docker-compose ps
```

Expected output:
- ✅ job-portal-mongodb (healthy)
- ✅ job-portal-backend (healthy)
- ✅ job-portal-frontend (healthy)

## Domain Configuration

### Primary Domain: joblink360.com
### Secondary Domain: hamrojob.com.np

### DNS Configuration

Point both domains to your server IP:

**Nameservers:**
- ns1.ehostingserver.com
- ns2.ehostingserver.com

**A Records:**
```
@ -> Your Server IP
www -> Your Server IP
```

### SSL/HTTPS Setup (Recommended)

For production, use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d joblink360.com -d www.joblink360.com
sudo certbot --nginx -d hamrojob.com.np -d www.hamrojob.com.np

# Auto-renewal
sudo certbot renew --dry-run
```

## Service Management

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Backup and Restore

### Backup MongoDB
```bash
docker exec job-portal-mongodb mongodump \
  --username admin \
  --password YOUR_PASSWORD \
  --authenticationDatabase admin \
  --out /backup

docker cp job-portal-mongodb:/backup ./mongodb-backup
```

### Restore MongoDB
```bash
docker cp ./mongodb-backup job-portal-mongodb:/backup

docker exec job-portal-mongodb mongorestore \
  --username admin \
  --password YOUR_PASSWORD \
  --authenticationDatabase admin \
  /backup
```

## Troubleshooting

### Services Not Starting

1. Check logs:
   ```bash
   docker-compose logs -f
   ```

2. Verify environment variables:
   ```bash
   cat .env
   ```

3. Check port conflicts:
   ```bash
   # Windows
   netstat -ano | findstr :80
   netstat -ano | findstr :5000
   netstat -ano | findstr :27017

   # Linux/Mac
   sudo lsof -i :80
   sudo lsof -i :5000
   sudo lsof -i :27017
   ```

### MongoDB Connection Issues

1. Check MongoDB is running:
   ```bash
   docker-compose ps mongodb
   ```

2. Test MongoDB connection:
   ```bash
   docker exec -it job-portal-mongodb mongosh \
     --username admin \
     --password YOUR_PASSWORD \
     --authenticationDatabase admin
   ```

### Frontend Not Loading

1. Check if backend is accessible:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Rebuild frontend:
   ```bash
   docker-compose build frontend
   docker-compose up -d frontend
   ```

## Production Optimization

### Resource Limits

Edit `docker-compose.yml` to add resource limits:

```yaml
services:
  mongodb:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Monitoring

Use Docker stats to monitor resources:
```bash
docker stats
```

### Log Rotation

Configure log rotation to prevent disk space issues:

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Security Checklist

- [ ] Changed default MongoDB password
- [ ] Set strong JWT_SECRET
- [ ] Configured firewall rules
- [ ] Enabled SSL/HTTPS
- [ ] Updated all environment variables
- [ ] Configured email notifications
- [ ] Set up automated backups
- [ ] Configured log rotation
- [ ] Disabled unnecessary ports
- [ ] Updated server OS and packages

## Support

**Contact:** magar.tirtha3@gmail.com  
**Domains:**
- https://joblink360.com
- https://hamrojob.com.np

## Architecture

```
┌─────────────────────────────────────────┐
│         Load Balancer/Nginx             │
│  (joblink360.com, hamrojob.com.np)      │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────▼─────┐    ┌────▼────────┐
│ Frontend │    │   Backend   │
│  (Port   │    │   (Port     │
│   80)    │◄───┤   5000)     │
└──────────┘    └──────┬──────┘
                       │
                  ┌────▼─────┐
                  │ MongoDB  │
                  │ (Port    │
                  │  27017)  │
                  └──────────┘
```
