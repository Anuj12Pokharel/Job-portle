# Quick Start - Ubuntu Deployment (Copy & Paste)

Just copy and paste these commands into your Ubuntu terminal!

## 📋 Prerequisites Check

```bash
# Check Ubuntu version (should be 20.04 or 22.04)
lsb_release -a

# Check internet connection
ping -c 3 google.com
```

## 🚀 One-Command Deployment

```bash
# Clone repository (if not already done)
cd /home/$USER
git clone YOUR_REPO_URL Job-portle
cd Job-portle

# Make deployment script executable
chmod +x deploy-ubuntu.sh

# Run deployment (this will install Docker if needed)
./deploy-ubuntu.sh
```

That's it! The script will:
1. Check for Docker (install if missing)
2. Create `.env` file from template
3. Build all Docker images
4. Start all services
5. Verify deployment

## ⚙️ Quick Configuration

Before first run, edit your `.env`:

```bash
nano .env
```

Update these values:
- `MONGO_ROOT_PASSWORD` - Choose a strong password
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `EMAIL_USER` - Your Gmail: magar.tirtha3@gmail.com
- `EMAIL_PASS` - Gmail App Password (see guide below)

**Save:** `Ctrl+X`, `Y`, `Enter`

## 📧 Get Gmail App Password

```bash
# Open in browser:
# 1. https://myaccount.google.com/security
# 2. Enable "2-Step Verification"
# 3. Go to https://myaccount.google.com/apppasswords
# 4. Create app password for "Mail"
# 5. Copy 16-character password to .env
```

## 🌐 DNS Configuration

Point your domains to server IP:

```bash
# Get your server IP
curl ifconfig.me

# Then add these DNS records:
# Type: A, Name: @, Value: YOUR_SERVER_IP
# Type: A, Name: www, Value: YOUR_SERVER_IP
```

For both:
- joblink360.com
- hamrojob.com.np

## 🔒 Enable SSL (After DNS is configured)

```bash
# Install Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Stop frontend temporarily
docker-compose stop frontend

# Get certificates
sudo certbot certonly --standalone \
  -d joblink360.com -d www.joblink360.com \
  --email magar.tirtha3@gmail.com --agree-tos --no-eff-email

sudo certbot certonly --standalone \
  -d hamrojob.com.np -d www.hamrojob.com.np \
  --email magar.tirtha3@gmail.com --agree-tos --no-eff-email

# Update nginx config (see UBUNTU_DEPLOYMENT.md)
nano vite-project/nginx.conf

# Rebuild and restart
docker-compose build frontend
docker-compose up -d
```

## 🎯 Essential Commands

```bash
# View all logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart
docker-compose restart

# Update application
git pull
docker-compose build
docker-compose up -d

# Backup MongoDB
docker exec job-portal-mongodb mongodump \
  --username admin \
  --password YOUR_PASSWORD \
  --out /backup
```

## ✅ Verify Everything Works

```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost

# Check containers
docker-compose ps
```

You should see:
- job-portal-mongodb (healthy)
- job-portal-backend (healthy)
- job-portal-frontend (healthy)

## 🆘 Troubleshooting

### Port already in use?
```bash
# Check what's using port 80
sudo lsof -i :80

# Stop nginx if installed
sudo systemctl stop nginx
sudo systemctl disable nginx
```

### Container won't start?
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Docker permission denied?
```bash
# Add to docker group
sudo usermod -aG docker $USER

# Logout and login again
exit
```

## 📞 Support

**Email:** magar.tirtha3@gmail.com  
**Full Guide:** See `UBUNTU_DEPLOYMENT.md`

---

## 🎉 Complete Setup Script (Copy All)

```bash
#!/bin/bash
# Complete setup - copy and run this entire block

cd /home/$USER

# Clone if not exists
if [ ! -d "Job-portle" ]; then
    git clone YOUR_REPO_URL Job-portle
fi

cd Job-portle

# Make executable
chmod +x deploy-ubuntu.sh

# Deploy
./deploy-ubuntu.sh
```

**Domains:**
- https://joblink360.com
- https://hamrojob.com.np

**Nameservers:**
- ns1.ehostingserver.com
- ns2.ehostingserver.com
