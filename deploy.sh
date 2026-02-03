#!/bin/bash

# Job Portal One-Click Deployment Script
# For joblink360.com and hamrojob.com.np

set -e

echo "🚀 Starting Job Portal Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp .env.production .env
    echo -e "${RED}❌ Please update .env file with your actual credentials before deploying!${NC}"
    echo -e "${YELLOW}Edit the .env file and run this script again.${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down || true

# Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build --no-cache

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service status
echo -e "${GREEN}📊 Checking service status...${NC}"
docker-compose ps

# Show logs
echo -e "${GREEN}📝 Recent logs:${NC}"
docker-compose logs --tail=50

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Your application is now running at:"
echo "   - http://localhost (Frontend)"
echo "   - http://localhost:5000 (Backend API)"
echo "   - MongoDB: localhost:27017"
echo ""
echo "📋 Domain Configuration:"
echo "   - Primary: joblink360.com"
echo "   - Secondary: hamrojob.com.np"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop: docker-compose down"
echo "   - Restart: docker-compose restart"
echo "   - Update: docker-compose pull && docker-compose up -d"
echo ""
echo "📧 Contact: magar.tirtha3@gmail.com"
echo ""
