#!/bin/bash
# SSL Certificate Generation Script for joblink360.com and hamrojob.com.np

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  SSL Certificate Generation for Job Portal                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if DNS is configured
echo "Step 1: Verifying DNS configuration..."
echo "----------------------------------------"

check_dns() {
    domain=$1
    echo "Checking $domain..."
    resolved_ip=$(nslookup $domain | grep 'Address:' | tail -n1 | awk '{print $2}')
    expected_ip="161.97.75.244"
    
    if [[ "$resolved_ip" == "$expected_ip" ]]; then
        echo "✓ $domain resolves to $expected_ip"
        return 0
    else
        echo "✗ $domain does NOT resolve to $expected_ip (got: $resolved_ip)"
        return 1
    fi
}

dns_ok=true
check_dns "joblink360.com" || dns_ok=false
check_dns "www.joblink360.com" || dns_ok=false
check_dns "hamrojob.com.np" || dns_ok=false
check_dns "www.hamrojob.com.np" || dns_ok=false

if [ "$dns_ok" = false ]; then
    echo ""
    echo "⚠️  DNS is not properly configured!"
    echo "Please configure your DNS A records and wait for propagation before continuing."
    exit 1
fi

echo ""
echo "Step 2: Creating certbot directories..."
echo "----------------------------------------"
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

echo ""
echo "Step 3: Stopping system nginx (if running)..."
echo "-----------------------------------------------"
sudo systemctl stop nginx || true

echo ""
echo "Step 4: Starting frontend container for certificate validation..."
echo "------------------------------------------------------------------"
docker-compose up -d frontend

echo ""
echo "Step 5: Generating SSL certificate for joblink360.com..."
echo "----------------------------------------------------------"
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email magar.tirtha3@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d joblink360.com \
    -d www.joblink360.com

echo ""
echo "Step 6: Generating SSL certificate for hamrojob.com.np..."
echo "-----------------------------------------------------------"
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email magar.tirtha3@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d hamrojob.com.np \
    -d www.hamrojob.com.np

echo ""
echo "Step 7: Restarting all services with SSL..."
echo "--------------------------------------------"
docker-compose down
docker-compose up -d

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✓ SSL Certificates Generated Successfully!                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Your site is now accessible at:"
echo "  • https://joblink360.com"
echo "  • https://hamrojob.com.np (redirects to joblink360.com)"
echo ""
echo "SSL certificates will auto-renew every 12 hours via the certbot container."
echo ""
