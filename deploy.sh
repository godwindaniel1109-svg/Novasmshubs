#!/bin/bash

# NovaSMSHubs Deployment Script
# This script helps deploy all components of NovaSMSHubs

echo "🚀 NovaSMSHubs Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js $REQUIRED_VERSION or higher."
    exit 1
fi

print_status "Node.js version: $NODE_VERSION ✓"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm -v) ✓"

# Function to install dependencies
install_dependencies() {
    local dir=$1
    local name=$2
    
    if [ -d "$dir" ]; then
        print_status "Installing dependencies for $name..."
        cd "$dir"
        npm install --production
        if [ $? -eq 0 ]; then
            print_status "$name dependencies installed successfully ✓"
        else
            print_error "Failed to install $name dependencies"
            exit 1
        fi
        cd ..
    else
        print_error "Directory $dir not found"
        exit 1
    fi
}

# Function to build frontend
build_frontend() {
    local dir=$1
    local name=$2
    
    if [ -d "$dir" ]; then
        print_status "Building $name..."
        cd "$dir"
        npm run build
        if [ $? -eq 0 ]; then
            print_status "$name built successfully ✓"
        else
            print_error "Failed to build $name"
            exit 1
        fi
        cd ..
    else
        print_error "Directory $dir not found"
        exit 1
    fi
}

# Install backend dependencies
print_status "Setting up backend dependencies..."
install_dependencies "backend" "Main Backend"

# Install admin backend dependencies
print_status "Setting up admin backend dependencies..."
install_dependencies "admin-backend" "Admin Backend"

# Build main frontend
print_status "Building main frontend..."
build_frontend "frontend" "Main Frontend"

# Build admin frontend
print_status "Building admin frontend..."
build_frontend "admin-frontend" "Admin Frontend"

# Create uploads directory if it doesn't exist
if [ ! -d "backend/uploads" ]; then
    mkdir -p "backend/uploads"
    print_status "Created uploads directory ✓"
fi

if [ ! -d "admin-backend/uploads" ]; then
    mkdir -p "admin-backend/uploads"
    print_status "Created admin uploads directory ✓"
fi

# Database setup reminder
print_warning "Please ensure your MySQL database is set up:"
echo "  - Database name: novasmshubs"
echo "  - User: root (or your configured user)"
echo "  - Tables will be created automatically"

# Environment setup reminder
print_warning "Please configure your environment variables:"
echo "  - Copy backend/.env.example to backend/.env"
echo "  - Copy admin-backend/.env.example to admin-backend/.env"
echo "  - Update with your actual credentials"

# Deployment instructions
echo ""
print_status "Deployment Ready! 🎉"
echo ""
echo "To start the services:"
echo "  Main Backend:    cd backend && npm start (Port 5000)"
echo "  Admin Backend:    cd admin-backend && npm start (Port 5001)"
echo "  Main Frontend:   Deploy frontend/build/ to your web server"
echo "  Admin Frontend:  Deploy admin-frontend/build/ to your admin web server"
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@novasmshubs.com"
echo "  Password: admin123"
echo ""
print_status "Deployment script completed successfully! 🚀"
