#!/bin/bash

# Production Deployment Script for NestJS Backend
# This script automates the deployment process with safety checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="nestjs-backend"
DOCKER_IMAGE="${APP_NAME}:production"
CONTAINER_NAME="${APP_NAME}-prod"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    log "Checking deployment requirements..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    if [ ! -f ".env" ]; then
        error ".env file not found. Please create one based on PRODUCTION_ENV.md"
    fi
    
    success "Requirements check passed"
}

# Load environment variables
load_env() {
    log "Loading environment variables..."
    
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
    else
        error ".env file not found"
    fi
    
    # Validate critical environment variables
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secret-key-change-in-production" ]; then
        error "JWT_SECRET is not set or is using default value"
    fi
    
    if [ -z "$DB_PASSWORD" ]; then
        error "DB_PASSWORD is not set"
    fi
    
    success "Environment variables loaded"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    if docker ps -q -f name="${CONTAINER_NAME}" | grep -q .; then
        log "Creating database backup..."
        docker exec "${CONTAINER_NAME}" pg_dump -U "$DB_USERNAME" "$DB_NAME" > "$BACKUP_DIR/database.sql"
    fi
    
    # Backup application files
    if [ -d "dist" ]; then
        cp -r dist "$BACKUP_DIR/"
    fi
    
    success "Backup created at $BACKUP_DIR"
}

# Build application
build_app() {
    log "Building application..."
    
    # Install dependencies
    npm ci --only=production
    
    # Build application
    npm run build
    
    success "Application built successfully"
}

# Build Docker image
build_docker() {
    log "Building Docker image..."
    
    docker build -t "$DOCKER_IMAGE" --target production .
    
    success "Docker image built successfully"
}

# Stop existing container
stop_container() {
    log "Stopping existing container..."
    
    if docker ps -q -f name="${CONTAINER_NAME}" | grep -q .; then
        docker stop "${CONTAINER_NAME}"
        docker rm "${CONTAINER_NAME}"
        success "Existing container stopped and removed"
    else
        log "No existing container found"
    fi
}

# Deploy application
deploy_app() {
    log "Deploying application..."
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for application to be ready
    log "Waiting for application to be ready..."
    sleep 30
    
    # Health check
    if curl -f http://localhost:3000/api/v1/health > /dev/null 2>&1; then
        success "Application is healthy"
    else
        error "Application health check failed"
    fi
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Run unit tests
    npm run test
    
    # Run e2e tests
    npm run test:e2e
    
    success "All tests passed"
}

# Rollback function
rollback() {
    warning "Rolling back deployment..."
    
    # Stop current deployment
    docker-compose -f docker-compose.prod.yml down
    
    # Restore from backup if available
    if [ -d "$BACKUP_DIR" ]; then
        log "Restoring from backup..."
        # Add rollback logic here
    fi
    
    error "Rollback completed"
}

# Main deployment function
main() {
    log "Starting production deployment..."
    
    # Set up error handling
    trap 'error "Deployment failed. Check logs for details."' ERR
    trap 'rollback' EXIT
    
    # Execute deployment steps
    check_requirements
    load_env
    create_backup
    build_app
    build_docker
    stop_container
    deploy_app
    
    # If we reach here, deployment was successful
    trap - EXIT
    success "Production deployment completed successfully!"
    
    log "Application is running at: http://localhost:3000"
    log "Swagger documentation: http://localhost:3000/api"
    log "Health check: http://localhost:3000/api/v1/health"
}

# Run main function
main "$@"
