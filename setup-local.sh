#\!/bin/bash

# LinguaLeap Local Setup Script
# Automates the complete local development environment setup

set -e  # Exit on any error

echo "🚀 LinguaLeap Local Setup Starting..."
echo "======================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Utility functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if \! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version must be 18 or higher. Current: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if \! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm 9+ and try again."
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        log_success "Docker found - will use containerized databases"
        USE_DOCKER=true
    else
        log_warning "Docker not found - will require manual database setup"
        USE_DOCKER=false
    fi
    
    log_success "Prerequisites check completed"
}

# Setup environment files
setup_environment() {
    log_info "Setting up environment files..."
    
    # Backend environment
    if [ \! -f "backend/.env" ]; then
        log_info "Creating backend/.env from example..."
        cp .env.local.example backend/.env
        
        # Generate secure JWT secret
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "lingualeap_dev_jwt_secret_2024_$(date +%s)")
        sed -i.bak "s/your_super_secure_jwt_secret_key_minimum_32_characters_long/$JWT_SECRET/" backend/.env
        rm -f backend/.env.bak
        
        log_success "Backend environment configured"
    else
        log_warning "Backend .env already exists - skipping"
    fi
    
    # Frontend environment
    if [ \! -f "frontend/.env.local" ]; then
        log_info "Creating frontend/.env.local from example..."
        cp frontend/.env.local.example frontend/.env.local
        log_success "Frontend environment configured"
    else
        log_warning "Frontend .env.local already exists - skipping"
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install workspace dependencies
    npm run bootstrap
    
    log_success "Dependencies installed successfully"
}

# Setup databases
setup_databases() {
    if [ "$USE_DOCKER" = true ]; then
        log_info "Starting containerized databases..."
        
        # Start databases
        docker-compose -f docker-compose.local.yml up -d postgres redis
        
        # Wait for databases to be ready
        log_info "Waiting for databases to be ready..."
        sleep 15
        
        # Test database connection
        until docker-compose -f docker-compose.local.yml exec -T postgres pg_isready -U lingualeap -d lingualeap_dev; do
            log_info "Waiting for PostgreSQL..."
            sleep 2
        done
        
        log_success "Databases started successfully"
    else
        log_warning "Docker not available - please ensure PostgreSQL and Redis are running manually"
        log_info "PostgreSQL connection string: postgresql://lingualeap:dev_password_2024@localhost:5432/lingualeap_dev"
        log_info "Redis connection string: redis://localhost:6379"
    fi
}

# Setup database schema
setup_database_schema() {
    log_info "Setting up database schema..."
    
    cd backend
    
    # Generate Prisma client
    npm run db:generate
    
    # Apply database migrations
    npm run db:push
    
    # Seed database with initial data
    npm run db:seed
    
    cd ..
    
    log_success "Database schema setup completed"
}

# Verify setup
verify_setup() {
    log_info "Verifying setup..."
    
    # Check backend build
    cd backend
    npm run type-check
    if [ $? -eq 0 ]; then
        log_success "Backend TypeScript compilation successful"
    else
        log_error "Backend TypeScript compilation failed"
        return 1
    fi
    cd ..
    
    # Check frontend build
    cd frontend
    npm run type-check
    if [ $? -eq 0 ]; then
        log_success "Frontend TypeScript compilation successful"
    else
        log_error "Frontend TypeScript compilation failed"
        return 1
    fi
    cd ..
    
    log_success "Setup verification completed"
}

# Main setup flow
main() {
    log_info "Starting LinguaLeap local setup..."
    
    check_prerequisites
    setup_environment
    install_dependencies
    setup_databases
    setup_database_schema
    verify_setup
    
    echo ""
    echo "🎉 Setup completed successfully\!"
    echo "=============================="
    echo ""
    log_success "Your LinguaLeap development environment is ready\!"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Start the development servers:"
    echo "     npm run dev"
    echo ""
    echo "  2. Open your browser:"
    echo "     Frontend: http://localhost:3000"
    echo "     Backend: http://localhost:5000"
    echo ""
    echo "  3. Optional admin tools:"
    if [ "$USE_DOCKER" = true ]; then
        echo "     PgAdmin: http://localhost:8080 (admin@lingualeap.local / admin123)"
        echo "     Redis Commander: http://localhost:8081"
    fi
    echo "     Prisma Studio: npm run db:studio (in backend folder)"
    echo ""
    echo "  4. Test features:"
    echo "     ✅ Register a new user account"
    echo "     ✅ Test Web Speech API (allow microphone access)"
    echo "     ✅ Try pronunciation practice"
    echo "     ✅ Check user preferences"
    echo ""
    log_warning "Note: Whisper API is disabled - using Web Speech API fallback"
}

# Handle script interruption
trap 'log_error "Setup interrupted"; exit 1' INT

# Run main function
main "$@"
EOF < /dev/null
