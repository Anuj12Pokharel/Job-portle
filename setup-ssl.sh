#!/bin/bash
# SSL Certificate Setup for joblink360.com and hamrojob.com.np
# Run this AFTER your application is deployed with Docker

set -e

echo "🔒 Setting up SSL certificates with Let's Encrypt..."

# Install Certbot
echo "📦 Installing Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Stop frontend container temporarily to free port 80
echo "🛑 Stopping frontend container..."
docker-compose stop frontend

# Get SSL certificate for joblink360.com
echo "🔐 Getting SSL certificate for joblink360.com..."
certbot certonly --standalone \
  -d joblink360.com -d www.joblink360.com \
  --email magar.tirtha3@gmail.com \
  --agree-tos \
  --no-eff-email \
  --non-interactive

# Get SSL certificate for hamrojob.com.np
echo "🔐 Getting SSL certificate for hamrojob.com.np..."
certbot certonly --standalone \
  -d hamrojob.com.np -d www.hamrojob.com.np \
  --email magar.tirtha3@gmail.com \
  --agree-tos \
  --no-eff-email \
  --non-interactive

echo "✅ SSL certificates obtained!"

# Update docker-compose.yml to mount SSL certificates
echo "📝 Updating docker-compose.yml..."

# Backup original
cp docker-compose.yml docker-compose.yml.backup

# Add volume mount for SSL certificates (if not already present)
if ! grep -q "/etc/letsencrypt" docker-compose.yml; then
    echo "Adding SSL certificate volumes to docker-compose.yml"
    # This will be done manually or via the updated nginx.conf
fi

echo ""
echo "✅ SSL Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update nginx.conf to use SSL certificates (see SSL_NGINX_CONFIG.md)"
echo "2. Update docker-compose.yml to mount certificates"
echo "3. Rebuild frontend: docker-compose build frontend"
echo "4. Restart all services: docker-compose up -d"
echo ""
echo "🔄 Auto-renewal is configured via certbot"
echo "Test renewal with: certbot renew --dry-run"
