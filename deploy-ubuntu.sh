#!/bin/bash

#########################################################
# Job Portal - Ubuntu One-Click Deployment Script
# For: joblink360.com and hamrojob.com.np
# Contact: magar.tirtha3@gmail.com
#########################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║       Job Portal - Ubuntu Deployment Script          ║"
echo "║       joblink360.com | hamrojob.com.np                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run this script as root${NC}"
    echo -e "${YELLOW}Run as regular user: ./deploy-ubuntu.sh${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print step
print_step() {
    echo -e "\n${BLUE}==>${NC} ${GREEN}$1${NC}"
}

# Step 1: Check Prerequisites
print_step "Step 1: Checking prerequisites..."

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo -e "${YELLOW}Installing Docker...${NC}"
    
    # Update package list
    sudo apt update
    
    # Install dependencies
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    
    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    echo -e "${YELLOW}⚠️  Docker installed! Please logout and login again, then run this script again.${NC}"
    exit 0
fi

if ! command_exists docker-compose; then
    echo -e "${YELLOW}Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Check Docker permissions
if ! docker ps >/dev/null 2>&1; then
    echo -e "${RED}❌ Current user doesn't have Docker permissions${NC}"
    echo -e "${YELLOW}Adding user to docker group...${NC}"
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}⚠️  Please logout and login again, then run this script again.${NC}"
    exit 0
fi

# Step 2: Check Environment File
print_step "Step 2: Checking environment configuration..."

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    
    if [ -f .env.production ]; then
        cp .env.production .env
        echo -e "${YELLOW}Please edit .env file with your credentials:${NC}"
        echo -e "  - MONGO_ROOT_PASSWORD"
        echo -e "  - JWT_SECRET"
        echo -e "  - EMAIL_USER"
        echo -e "  - EMAIL_PASS"
        echo -e ""
        read -p "Press Enter to edit .env now (or Ctrl+C to exit and edit manually)..."
        ${EDITOR:-nano} .env
    else
        echo -e "${RED}❌ .env.production template not found!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Environment file exists${NC}"

# Step 3: Stop Existing Containers
print_step "Step 3: Stopping existing containers..."
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✅ Stopped existing containers${NC}"

# Step 4: Build Docker Images
print_step "Step 4: Building Docker images..."
echo -e "${YELLOW}This may take several minutes...${NC}"

if docker-compose build --no-cache; then
    echo -e "${GREEN}✅ Docker images built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build Docker images${NC}"
    exit 1
fi

# Step 5: Start Services
print_step "Step 5: Starting services..."

if docker-compose up -d; then
    echo -e "${GREEN}✅ Services started${NC}"
else
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi

# Step 6: Wait for Services
print_step "Step 6: Waiting for services to be healthy..."
echo -e "${YELLOW}This may take up to 60 seconds...${NC}"

TIMEOUT=60
ELAPSED=0
while [ $ELAPSED -lt $TIMEOUT ]; do
    if docker-compose ps | grep -q "unhealthy"; then
        echo -e "${YELLOW}Waiting for services... ($ELAPSED/$TIMEOUT seconds)${NC}"
        sleep 5
        ELAPSED=$((ELAPSED + 5))
    else
        break
    fi
done

# Step 7: Check Service Status
print_step "Step 7: Checking service status..."
echo ""
docker-compose ps
echo ""

# Check if services are running
RUNNING=$(docker-compose ps --services --filter "status=running" | wc -l)
TOTAL=$(docker-compose ps --services | wc -l)

if [ $RUNNING -eq $TOTAL ]; then
    echo -e "${GREEN}✅ All services are running ($RUNNING/$TOTAL)${NC}"
else
    echo -e "${YELLOW}⚠️  Some services may not be running ($RUNNING/$TOTAL)${NC}"
    echo -e "${YELLOW}Check logs with: docker-compose logs -f${NC}"
fi

# Step 8: Test Services
print_step "Step 8: Testing services..."

# Test backend
if curl -f -s http://localhost:5000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Backend API is not responding yet${NC}"
fi

# Test frontend
if curl -f -s http://localhost >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is not responding yet${NC}"
fi

# Step 9: Display Information
print_step "Deployment Summary"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           🎉 DEPLOYMENT COMPLETED! 🎉                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📱 Application URLs:${NC}"
echo -e "   Local:     http://localhost"
echo -e "   Backend:   http://localhost:5000"
echo -e "   MongoDB:   localhost:27017"
echo ""
echo -e "${BLUE}🌐 Production Domains:${NC}"
echo -e "   Primary:   https://joblink360.com"
echo -e "   Secondary: https://hamrojob.com.np"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo -e "${BLUE}📝 Useful Commands:${NC}"
echo -e "   View logs:        ${YELLOW}docker-compose logs -f${NC}"
echo -e "   View backend:     ${YELLOW}docker-compose logs -f backend${NC}"
echo -e "   View frontend:    ${YELLOW}docker-compose logs -f frontend${NC}"
echo -e "   View MongoDB:     ${YELLOW}docker-compose logs -f mongodb${NC}"
echo -e "   Stop services:    ${YELLOW}docker-compose down${NC}"
echo -e "   Restart:          ${YELLOW}docker-compose restart${NC}"
echo -e "   Update app:       ${YELLOW}git pull && docker-compose build && docker-compose up -d${NC}"
echo ""
echo -e "${BLUE}🔒 Next Steps:${NC}"
echo -e "   1. Configure DNS A records to point to this server"
echo -e "   2. Set up SSL with Let's Encrypt (see UBUNTU_DEPLOYMENT.md)"
echo -e "   3. Configure automated backups"
echo -e "   4. Test the application thoroughly"
echo ""
echo -e "${BLUE}📧 Contact:${NC} magar.tirtha3@gmail.com"
echo -e "${BLUE}📘 Full Guide:${NC} See UBUNTU_DEPLOYMENT.md"
echo ""

# Ask if user wants to see logs
read -p "Would you like to view the logs now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi
