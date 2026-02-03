@echo off
REM Job Portal One-Click Deployment Script for Windows
REM For joblink360.com and hamrojob.com.np

echo Starting Job Portal Deployment...
echo.

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found. Creating from template...
    copy .env.production .env
    echo.
    echo ERROR: Please update .env file with your actual credentials before deploying!
    echo Edit the .env file and run this script again.
    pause
    exit /b 1
)

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Docker is running...
echo.

REM Stop existing containers
echo Stopping existing containers...
docker-compose down

REM Build images
echo Building Docker images...
docker-compose build --no-cache

REM Start services
echo Starting services...
docker-compose up -d

REM Wait for services
echo Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Check status
echo Checking service status...
docker-compose ps

REM Show logs
echo Recent logs:
docker-compose logs --tail=50

echo.
echo ========================================
echo Deployment completed successfully!
echo ========================================
echo.
echo Your application is now running at:
echo   - http://localhost (Frontend)
echo   - http://localhost:5000 (Backend API)
echo   - MongoDB: localhost:27017
echo.
echo Domain Configuration:
echo   - Primary: joblink360.com
echo   - Secondary: hamrojob.com.np
echo.
echo Useful commands:
echo   - View logs: docker-compose logs -f
echo   - Stop: docker-compose down
echo   - Restart: docker-compose restart
echo.
echo Contact: magar.tirtha3@gmail.com
echo.
pause
