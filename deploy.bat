@echo off
REM AI Wall Visualizer Deployment Script for Windows
REM This script provides multiple deployment options for the application

setlocal enabledelayedexpansion

REM Configuration
set APP_NAME=ai-wall-visualizer
set DOCKER_IMAGE=%APP_NAME%:latest
set DOCKER_CONTAINER=%APP_NAME%-container

REM Colors for output (Windows doesn't support ANSI colors in batch)
set INFO=[INFO]
set SUCCESS=[SUCCESS]
set WARNING=[WARNING]
set ERROR=[ERROR]

REM Helper functions
:print_info
echo %INFO% %~1
goto :eof

:print_success
echo %SUCCESS% %~1
goto :eof

:print_warning
echo %WARNING% %~1
goto :eof

:print_error
echo %ERROR% %~1
goto :eof

REM Check if Docker is installed
:check_docker
docker --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not installed. Please install Docker Desktop first."
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker Compose is not installed. Please install Docker Desktop first."
    exit /b 1
)
goto :eof

REM Build the application
:build_app
call :print_info "Building the application..."

REM Install dependencies
call npm ci
if errorlevel 1 (
    call :print_error "Failed to install dependencies"
    exit /b 1
)

REM Run type checking
call :print_info "Running type checking..."
call npm run type-check
if errorlevel 1 (
    call :print_error "Type checking failed"
    exit /b 1
)

REM Build the application
call :print_info "Building for production..."
call npm run build
if errorlevel 1 (
    call :print_error "Build failed"
    exit /b 1
)

call :print_success "Application built successfully!"
goto :eof

REM Build Docker image
:build_docker
call :print_info "Building Docker image..."

docker build -t %DOCKER_IMAGE% .
if errorlevel 1 (
    call :print_error "Docker build failed"
    exit /b 1
)

call :print_success "Docker image built successfully!"
goto :eof

REM Deploy with Docker Compose
:deploy_docker_compose
set profile=%~1
call :print_info "Deploying with Docker Compose (profile: %profile%)..."

REM Stop existing containers
docker-compose --profile %profile% down

REM Build and start containers
docker-compose --profile %profile% up -d --build
if errorlevel 1 (
    call :print_error "Docker Compose deployment failed"
    exit /b 1
)

call :print_success "Application deployed successfully!"
call :print_info "Access the application at: http://localhost:3000"
goto :eof

REM Deploy to Vercel
:deploy_vercel
call :print_info "Deploying to Vercel..."

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    call :print_warning "Vercel CLI not found. Installing..."
    call npm install -g vercel
)

REM Deploy to Vercel
vercel --prod
if errorlevel 1 (
    call :print_error "Vercel deployment failed"
    exit /b 1
)

call :print_success "Application deployed to Vercel!"
goto :eof

REM Health check
:health_check
call :print_info "Performing health check..."

REM Wait for the application to start
timeout /t 10 /nobreak >nul

REM Check if the application is responding
curl -f http://localhost:3000/health >nul 2>&1
if errorlevel 1 (
    call :print_error "Health check failed!"
    exit /b 1
)

call :print_success "Health check passed!"
goto :eof

REM Clean up
:cleanup
call :print_info "Cleaning up..."

REM Remove Docker containers and images
docker-compose down --rmi all --volumes --remove-orphans

REM Clean npm cache
call npm cache clean --force

REM Remove build artifacts
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules rmdir /s /q node_modules

call :print_success "Cleanup completed!"
goto :eof

REM Show usage
:show_usage
echo AI Wall Visualizer Deployment Script
echo.
echo Usage: %0 [OPTION]
echo.
echo Options:
echo   build              Build the application locally
echo   docker-build       Build Docker image
echo   docker-dev         Deploy with Docker Compose (development)
echo   docker-prod        Deploy with Docker Compose (production)
echo   docker-nginx       Deploy with Docker Compose + Nginx (production)
echo   vercel             Deploy to Vercel
echo   health             Perform health check
echo   cleanup            Clean up build artifacts and containers
echo   help               Show this help message
echo.
echo Examples:
echo   %0 build           # Build the application
echo   %0 docker-prod     # Deploy to production with Docker
echo   %0 vercel          # Deploy to Vercel
goto :eof

REM Main script
if "%1"=="" goto show_usage

if "%1"=="build" (
    call :build_app
    goto :eof
)

if "%1"=="docker-build" (
    call :check_docker
    call :build_docker
    goto :eof
)

if "%1"=="docker-dev" (
    call :check_docker
    call :deploy_docker_compose "dev"
    goto :eof
)

if "%1"=="docker-prod" (
    call :check_docker
    call :deploy_docker_compose "prod"
    call :health_check
    goto :eof
)

if "%1"=="docker-nginx" (
    call :check_docker
    call :deploy_docker_compose "prod-nginx"
    call :health_check
    goto :eof
)

if "%1"=="vercel" (
    call :deploy_vercel
    goto :eof
)

if "%1"=="health" (
    call :health_check
    goto :eof
)

if "%1"=="cleanup" (
    call :cleanup
    goto :eof
)

if "%1"=="help" (
    goto show_usage
)

call :print_error "Unknown option: %1"
goto show_usage
