# SSL Certificate Setup Guide

Complete guide for setting up HTTPS/SSL for joblink360.com and hamrojob.com.np

## Prerequisites

- ✅ Docker and Docker Compose installed
- ✅ Application deployed and running
- ✅ DNS records pointing to your server IP
- ✅ Ports 80 and 443 open in firewall

## Step 1: Verify DNS is Configured

```bash
# Check if domains point to your server
dig joblink360.com +short
dig hamrojob.com.np +short

# Should return your server's IP address
```

## Step 2: Install Certbot

```bash
# Update system
apt update

# Install Certbot
apt install -y certbot python3-certbot-nginx
```

## Step 3: Get SSL Certificates

```bash
# Stop frontend to free port 80
docker-compose stop frontend

# Get certificate for joblink360.com
certbot certonly --standalone \
  -d joblink360.com -d www.joblink360.com \
  --email magar.tirtha3@gmail.com \
  --agree-tos \
  --no-eff-email

# Get certificate for hamrojob.com.np
certbot certonly --standalone \
  -d hamrojob.com.np -d www.hamrojob.com.np \
  --email magar.tirtha3@gmail.com \
  --agree-tos \
  --no-eff-email
```

## Step 4: Update Nginx Configuration

Edit `vite-project/nginx.conf` to add SSL configuration:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name joblink360.com www.joblink360.com hamrojob.com.np www.hamrojob.com.np;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS server for joblink360.com
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
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        root /usr/share/nginx/html;
        index index.html;

        # Serve static files
        location / {
            try_files $uri $uri/ /index.html;
            add_header Cache-Control "no-cache";
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy
        location /api {
            proxy_pass http://backend:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Uploads proxy
        location /uploads {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # HTTPS server for hamrojob.com.np
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
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        root /usr/share/nginx/html;
        index index.html;

        # Serve static files
        location / {
            try_files $uri $uri/ /index.html;
            add_header Cache-Control "no-cache";
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy
        location /api {
            proxy_pass http://backend:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Uploads proxy
        location /uploads {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

## Step 5: Update docker-compose.yml

Add SSL certificate volumes to the frontend service:

```yaml
  frontend:
    build:
      context: ./vite-project
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL:-http://localhost:5000}
    container_name: job-portal-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend
    networks:
      - job-portal-network
```

## Step 6: Rebuild and Restart

```bash
# Update nginx config
nano vite-project/nginx.conf
# (paste the SSL configuration above)

# Update docker-compose.yml
nano docker-compose.yml
# (add the volumes line under frontend service)

# Rebuild frontend
docker-compose build frontend

# Restart all services
docker-compose up -d

# Check if running
docker-compose ps

# View logs
docker-compose logs frontend
```

## Step 7: Setup Auto-Renewal

```bash
# Test renewal
certbot renew --dry-run

# Add to crontab for automatic renewal
crontab -e

# Add this line (renews certificates twice daily and restarts frontend)
0 0,12 * * * certbot renew --quiet --post-hook "cd /root/Job-portle && docker-compose restart frontend"
```

## Step 8: Verify SSL

Visit your domains:
- https://joblink360.com
- https://hamrojob.com.np

You should see a green padlock 🔒 in the browser!

## Troubleshooting

### Port 80/443 Already in Use
```bash
# Check what's using the ports
lsof -i :80
lsof -i :443

# Stop nginx if installed
systemctl stop nginx
systemctl disable nginx
```

### Certificate Renewal Failed
```bash
# Check certbot logs
cat /var/log/letsencrypt/letsencrypt.log

# Manually renew
certbot renew --force-renewal
docker-compose restart frontend
```

### Domain Not Resolving
```bash
# Check DNS
dig joblink360.com
nslookup joblink360.com

# Wait for DNS propagation (can take up to 48 hours)
```

## Quick SSL Setup (One Command)

```bash
# All in one
apt update && apt install -y certbot python3-certbot-nginx && \
docker-compose stop frontend && \
certbot certonly --standalone -d joblink360.com -d www.joblink360.com --email magar.tirtha3@gmail.com --agree-tos --no-eff-email && \
certbot certonly --standalone -d hamrojob.com.np -d www.hamrojob.com.np --email magar.tirtha3@gmail.com --agree-tos --no-eff-email && \
echo "✅ SSL certificates obtained! Update nginx.conf and docker-compose.yml, then rebuild."
```

## Certificate Locations

- **joblink360.com**: `/etc/letsencrypt/live/joblink360.com/`
- **hamrojob.com.np**: `/etc/letsencrypt/live/hamrojob.com.np/`

Each contains:
- `fullchain.pem` - Full certificate chain
- `privkey.pem` - Private key
- `cert.pem` - Certificate only
- `chain.pem` - Chain only

## Support

Contact: magar.tirtha3@gmail.com

Domains:
- https://joblink360.com
- https://hamrojob.com.np
