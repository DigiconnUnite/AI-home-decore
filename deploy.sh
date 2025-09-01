#!/bin/bash

# AI Wall Visualizer Deployment Script
# This script provides multiple deployment options for the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ai-wall-visualizer"
DOCKER_IMAGE="${APP_NAME}:latest"
DOCKER_CONTAINER="${APP_NAME}-container"

# Helper functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Build the application
build_app() {
    print_info "Building the application..."
    
    # Install dependencies
    npm ci
    
    # Run type checking
    print_info "Running type checking..."
    npm run type-check
    
    # Build the application
    print_info "Building for production..."
    npm run build
    
    print_success "Application built successfully!"
}

# Build Docker image
build_docker() {
    print_info "Building Docker image..."
    
    docker build -t $DOCKER_IMAGE .
    
    print_success "Docker image built successfully!"
}

# Deploy with Docker Compose
deploy_docker_compose() {
    local profile=$1
    
    print_info "Deploying with Docker Compose (profile: $profile)..."
    
    # Stop existing containers
    docker-compose --profile $profile down
    
    # Build and start containers
    docker-compose --profile $profile up -d --build
    
    print_success "Application deployed successfully!"
    print_info "Access the application at: http://localhost:3000"
}

# Deploy to Vercel
deploy_vercel() {
    print_info "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    print_success "Application deployed to Vercel!"
}

# Deploy to Netlify
deploy_netlify() {
    print_info "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Build the application
    build_app
    
    # Deploy to Netlify
    netlify deploy --prod --dir=out
    
    print_success "Application deployed to Netlify!"
}

# Deploy to AWS
deploy_aws() {
    print_info "Deploying to AWS..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    # Build Docker image
    build_docker
    
    # Push to ECR (you'll need to configure this)
    print_warning "Please configure AWS ECR repository and push the image manually."
    print_info "Example:"
    print_info "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com"
    print_info "docker tag $DOCKER_IMAGE YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/$DOCKER_IMAGE"
    print_info "docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/$DOCKER_IMAGE"
}

# Health check
health_check() {
    print_info "Performing health check..."
    
    # Wait for the application to start
    sleep 10
    
    # Check if the application is responding
    if curl -f http://localhost:3000/health &> /dev/null; then
        print_success "Health check passed!"
    else
        print_error "Health check failed!"
        exit 1
    fi
}

# Clean up
cleanup() {
    print_info "Cleaning up..."
    
    # Remove Docker containers and images
    docker-compose down --rmi all --volumes --remove-orphans
    
    # Clean npm cache
    npm cache clean --force
    
    # Remove build artifacts
    rm -rf .next out node_modules
    
    print_success "Cleanup completed!"
}

# Show usage
show_usage() {
    echo "AI Wall Visualizer Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  build              Build the application locally"
    echo "  docker-build       Build Docker image"
    echo "  docker-dev         Deploy with Docker Compose (development)"
    echo "  docker-prod        Deploy with Docker Compose (production)"
    echo "  docker-nginx       Deploy with Docker Compose + Nginx (production)"
    echo "  vercel             Deploy to Vercel"
    echo "  netlify            Deploy to Netlify"
    echo "  aws                Deploy to AWS (requires configuration)"
    echo "  health             Perform health check"
    echo "  cleanup            Clean up build artifacts and containers"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build           # Build the application"
    echo "  $0 docker-prod     # Deploy to production with Docker"
    echo "  $0 vercel          # Deploy to Vercel"
}

# Main script
main() {
    case "${1:-help}" in
        build)
            build_app
            ;;
        docker-build)
            check_docker
            build_docker
            ;;
        docker-dev)
            check_docker
            deploy_docker_compose "dev"
            ;;
        docker-prod)
            check_docker
            deploy_docker_compose "prod"
            health_check
            ;;
        docker-nginx)
            check_docker
            deploy_docker_compose "prod-nginx"
            health_check
            ;;
        vercel)
            deploy_vercel
            ;;
        netlify)
            deploy_netlify
            ;;
        aws)
            check_docker
            deploy_aws
            ;;
        health)
            health_check
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
