# Job Portal - Ubuntu Server Deployment Guide

Complete guide for deploying to Ubuntu server with Docker and MongoDB on the same server.

## Server Requirements

- Ubuntu 20.04 or 22.04 LTS
- Minimum 2GB RAM (4GB recommended)
- 20GB disk space
- Root or sudo access

## Step 1: Initial Server Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Required Packages
```bash
sudo apt install -y curl git ufw
```

### Configure Firewall
```bash
# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

## Step 2: Install Docker & Docker Compose

### Install Docker
```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (logout/login required)
sudo usermod -aG docker $USER

# Verify installation
docker --version
```

### Install Docker Compose (Standalone)
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

**⚠️ IMPORTANT:** Log out and log back in for docker group changes to take effect!

```bash
# Method 1: Logout and login again
exit

# Method 2: Apply group changes immediately (run in new terminal)
su - $USER
```

## Step 3: Clone Repository

```bash
# Clone your repository
cd /home/$USER
git clone https://github.com/yourusername/Job-portle.git
cd Job-portle

# Or if already cloned, pull latest changes
git pull origin main
```

## Step 4: Configure Environment

### Create Production Environment File
```bash
# Copy template
cp .env.production .env

# Edit with nano or vi
nano .env
```

### Update `.env` with Production Values:
```env
# MongoDB Configuration
MONGO_ROOT_PASSWORD=YourStrongPasswordHere2026!
MONGO_URI=mongodb://admin:YourStrongPasswordHere2026!@mongodb:27017/job-portal?authSource=admin

# JWT Secret (generate random string)
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-chars-long

# Email Configuration
EMAIL_USER=magar.tirtha3@gmail.com
EMAIL_PASS=your-gmail-app-password

# Frontend URL
FRONTEND_URL=https://joblink360.com

# Backend API URL
VITE_API_BASE_URL=https://joblink360.com/api

# Node Environment
NODE_ENV=production
PORT=5000

# Domains
PRIMARY_DOMAIN=joblink360.com
SECONDARY_DOMAIN=hamrojob.com.np
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### Generate Strong JWT Secret
```bash
# Generate random 32-character string
openssl rand -base64 32
```

### Setup Gmail App Password
1. Go to Google Account Settings: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Generate new app password for "Mail"
5. Copy the 16-character password to `.env` as `EMAIL_PASS`

## Step 5: One-Click Deployment

### Make Deploy Script Executable
```bash
chmod +x deploy.sh
```

### Run Deployment
```bash
./deploy.sh
```

The script will:
- ✅ Build Docker images
- ✅ Start MongoDB, Backend, Frontend
- ✅ Configure networking
- ✅ Set up persistent volumes
- ✅ Enable health checks

### Manual Deployment (Alternative)
```bash
# Build services
docker-compose build --no-cache

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f
```

## Step 6: Verify Deployment

### Check Running Containers
```bash
docker-compose ps
```

Expected output:
```
NAME                    STATUS              PORTS
job-portal-mongodb      Up (healthy)        27017/tcp
job-portal-backend      Up (healthy)        0.0.0.0:5000->5000/tcp
job-portal-frontend     Up (healthy)        0.0.0.0:80->80/tcp
```

### Test Backend API
```bash
curl http://localhost:5000/api/health
```

### Test Frontend
```bash
curl http://localhost
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

## Step 7: Domain Configuration

### DNS Settings for joblink360.com and hamrojob.com.np

#### Nameservers (already set):
- ns1.ehostingserver.com
- ns2.ehostingserver.com

#### Add A Records:
Point both domains to your server's public IP:

```
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      3600
A       www     YOUR_SERVER_IP      3600
```

Get your server IP:
```bash
curl ifconfig.me
```

#### Verify DNS Propagation
```bash
# Check DNS
dig joblink360.com
dig hamrojob.com.np

# Or use online tools:
# https://dnschecker.org
```

## Step 8: SSL/HTTPS Setup with Let's Encrypt

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Stop Frontend Container (temporarily)
```bash
docker-compose stop frontend
```

### Get SSL Certificates
```bash
# For joblink360.com
sudo certbot certonly --standalone -d joblink360.com -d www.joblink360.com --email magar.tirtha3@gmail.com --agree-tos --no-eff-email

# For hamrojob.com.np
sudo certbot certonly --standalone -d hamrojob.com.np -d www.hamrojob.com.np --email magar.tirtha3@gmail.com --agree-tos --no-eff-email
```

### Update Nginx Configuration
```bash
nano vite-project/nginx.conf
```

Add SSL configuration:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name joblink360.com www.joblink360.com hamrojob.com.np www.hamrojob.com.np;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name joblink360.com www.joblink360.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/joblink360.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/joblink360.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /usr/share/nginx/html;
    index index.html;

    # Your existing location blocks...
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hamrojob.com.np www.hamrojob.com.np;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/hamrojob.com.np/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hamrojob.com.np/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /usr/share/nginx/html;
    index index.html;

    # Your existing location blocks...
}
```

### Update docker-compose.yml
```bash
nano docker-compose.yml
```

Add SSL volume mounts to frontend service:
```yaml
  frontend:
    # ... existing config ...
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

### Rebuild and Restart
```bash
docker-compose build frontend
docker-compose up -d
```

### Setup Auto-Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for auto-renewal
sudo crontab -e

# Add this line (runs twice daily):
0 0,12 * * * certbot renew --quiet --post-hook "docker-compose -f /home/$USER/Job-portle/docker-compose.yml restart frontend"
```

## Step 9: Production Optimizations

### Enable Log Rotation
```bash
sudo nano /etc/docker/daemon.json
```

Add:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
sudo systemctl restart docker
docker-compose up -d
```

### Setup Automated Backups

Create backup script:
```bash
nano ~/backup-mongodb.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec job-portal-mongodb mongodump \
  --username admin \
  --password YourStrongPasswordHere2026! \
  --authenticationDatabase admin \
  --out /backup

# Copy backup
docker cp job-portal-mongodb:/backup $BACKUP_DIR/mongodb_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "mongodb_*" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/mongodb_$DATE"
```

Make executable:
```bash
chmod +x ~/backup-mongodb.sh
```

Add to crontab (daily at 2 AM):
```bash
crontab -e

# Add:
0 2 * * * /home/$USER/backup-mongodb.sh >> /home/$USER/backup.log 2>&1
```

### Monitor Resources
```bash
# Real-time monitoring
docker stats

# Disk usage
df -h

# Docker disk usage
docker system df
```

## Step 10: Maintenance Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f backend
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart backend
```

### Stop Services
```bash
docker-compose down
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Clean Up
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

### Database Access
```bash
# MongoDB shell
docker exec -it job-portal-mongodb mongosh \
  --username admin \
  --password YourStrongPasswordHere2026! \
  --authenticationDatabase admin

# Inside MongoDB shell:
use job-portal
db.users.find().pretty()
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 80
sudo lsof -i :80

# Kill process
sudo kill -9 PID

# Or stop nginx if installed
sudo systemctl stop nginx
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild specific service
docker-compose build --no-cache backend
docker-compose up -d backend
```

### MongoDB Connection Failed
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Verify credentials in .env match
cat .env | grep MONGO
```

### Frontend 502 Bad Gateway
```bash
# Check if backend is running
docker-compose ps backend

# Test backend directly
curl http://localhost:5000/api/health

# Restart frontend
docker-compose restart frontend
```

### SSL Certificate Issues
```bash
# Renew manually
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates

# Reload nginx
docker-compose restart frontend
```

## Security Checklist

- [ ] Changed default MongoDB password
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configured firewall (ufw)
- [ ] Enabled SSL/HTTPS with Let's Encrypt
- [ ] Set up automated backups
- [ ] Configured log rotation
- [ ] Updated all environment variables
- [ ] Disabled root SSH login (optional but recommended)
- [ ] Set up fail2ban (optional)
- [ ] Regular system updates scheduled

### Optional: Disable Root SSH Login
```bash
sudo nano /etc/ssh/sshd_config

# Change:
PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd
```

### Optional: Install fail2ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Quick Reference

### Essential Commands
```bash
# Deploy
./deploy.sh

# View all logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Stop everything
docker-compose down

# Update app
git pull && docker-compose build && docker-compose up -d

# Backup MongoDB
docker exec job-portal-mongodb mongodump --username admin --password PASSWORD --out /backup
docker cp job-portal-mongodb:/backup ./backup-$(date +%Y%m%d)

# Monitor resources
docker stats

# Check disk space
df -h
```

## Support

**Contact:** magar.tirtha3@gmail.com  
**Domains:**
- https://joblink360.com
- https://hamrojob.com.np

**Nameservers:**
- ns1.ehostingserver.com
- ns2.ehostingserver.com

## Next Steps After Deployment

1. ✅ Verify all services are running
2. ✅ Test both domains
3. ✅ Check SSL certificates
4. ✅ Test job posting functionality
5. ✅ Test user registration
6. ✅ Test email notifications
7. ✅ Set up monitoring/alerts
8. ✅ Create initial admin accounts
9. ✅ Add content/jobs
10. ✅ Announce launch! 🚀
