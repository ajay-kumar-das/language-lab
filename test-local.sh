#\!/bin/bash

# LinguaLeap Local Testing Script
# Validates that all systems are working correctly

set -e

echo "🧪 LinguaLeap Local Testing Suite"
echo "================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    log_info "Testing: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        log_success "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        log_error "$test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Test database connectivity
test_database() {
    log_info "Testing database connectivity..."
    
    # Check PostgreSQL
    run_test "PostgreSQL Connection" "cd backend && npx prisma db execute --file=<(echo 'SELECT 1;') --schema=prisma/schema.prisma"
    
    # Check if tables exist
    run_test "Database Tables" "cd backend && npx prisma db execute --file=<(echo 'SELECT COUNT(*) FROM users;') --schema=prisma/schema.prisma"
}

# Test backend API
test_backend_api() {
    log_info "Testing backend API..."
    
    # Check if backend is running
    run_test "Backend Server Health" "curl -f http://localhost:5000/api/health"
    
    # Test API endpoints
    run_test "Auth Registration Endpoint" "curl -f -X POST http://localhost:5000/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"TestPass123\"}'"
    
    run_test "Speech Provider Status" "curl -f http://localhost:5000/api/speech/providers"
}

# Test frontend application
test_frontend() {
    log_info "Testing frontend application..."
    
    # Check if frontend is running
    run_test "Frontend Server" "curl -f http://localhost:3000"
    
    # Check if critical assets load
    run_test "Frontend Assets" "curl -f http://localhost:3000/assets/ || curl -f http://localhost:3000/static/"
}

# Test speech capabilities
test_speech_capabilities() {
    log_info "Testing speech system capabilities..."
    
    # This test requires a browser, so we'll check configuration instead
    run_test "Speech Configuration" "cd backend && node -e 'console.log(require(\"./dist/services/speech/SpeechOrchestrator\"))'"
    
    log_warning "Speech API testing requires browser interaction - test manually"
}

# Test caching system
test_caching() {
    log_info "Testing caching system..."
    
    # Test Redis connection (optional)
    if command -v redis-cli &> /dev/null; then
        run_test "Redis Connection" "redis-cli -a redis_dev_2024 ping"
    else
        log_warning "Redis CLI not available - testing memory cache fallback"
        run_test "Memory Cache Fallback" "cd backend && node -e 'const cache = require(\"node-cache\"); const c = new cache(); c.set(\"test\", \"value\"); console.log(c.get(\"test\"));'"
    fi
}

# Test environment configuration
test_environment() {
    log_info "Testing environment configuration..."
    
    run_test "Backend Environment" "cd backend && test -f .env"
    run_test "Frontend Environment" "cd frontend && test -f .env.local"
    run_test "Backend TypeScript" "cd backend && npm run type-check"
    run_test "Frontend TypeScript" "cd frontend && npm run type-check"
}

# Performance tests
test_performance() {
    log_info "Testing performance..."
    
    # Simple load test
    run_test "Backend Response Time" "curl -w '%{time_total}' -s -o /dev/null http://localhost:5000/api/health | awk '{if(\ < 1.0) exit 0; else exit 1}'"
    
    run_test "Frontend Load Time" "curl -w '%{time_total}' -s -o /dev/null http://localhost:3000 | awk '{if(\ < 3.0) exit 0; else exit 1}'"
}

# Integration tests
test_integration() {
    log_info "Running integration tests..."
    
    # Backend integration tests
    if [ -d "backend/src/__tests__/integration" ]; then
        run_test "Backend Integration Tests" "cd backend && npm run test:integration"
    fi
    
    # Frontend integration tests
    if [ -d "frontend/src/__tests__" ]; then
        run_test "Frontend Tests" "cd frontend && npm run test"
    fi
}

# Generate test report
generate_report() {
    echo ""
    echo "📊 Test Results Summary"
    echo "======================="
    echo "Total Tests: $TESTS_TOTAL"
    log_success "Passed: $TESTS_PASSED"
    if [ $TESTS_FAILED -gt 0 ]; then
        log_error "Failed: $TESTS_FAILED"
    else
        echo "Failed: 0"
    fi
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        log_success "🎉 All tests passed\! Your LinguaLeap environment is ready."
        echo ""
        echo "🎯 Ready for testing:"
        echo "  ✅ Authentication system"
        echo "  ✅ Web Speech API integration"
        echo "  ✅ Database operations"
        echo "  ✅ Caching system"
        echo "  ✅ User preferences"
        echo ""
        echo "🌐 Access your application:"
        echo "  • Frontend: http://localhost:3000"
        echo "  • Backend API: http://localhost:5000"
        echo "  • Database Admin: npm run db:studio (in backend folder)"
        
    else
        echo ""
        log_error "Some tests failed. Please check the logs above and fix issues."
        echo ""
        echo "Common fixes:"
        echo "  • Ensure databases are running: docker-compose -f docker-compose.local.yml up -d"
        echo "  • Check environment files are configured"
        echo "  • Run setup script: ./setup-local.sh"
        
        exit 1
    fi
}

# Manual test checklist
show_manual_tests() {
    echo ""
    echo "📋 Manual Testing Checklist"
    echo "==========================="
    echo ""
    echo "After automated tests pass, manually verify:"
    echo ""
    echo "🔐 Authentication (http://localhost:3000):"
    echo "  □ Register new user account"
    echo "  □ Login with credentials"
    echo "  □ Session persistence after refresh"
    echo "  □ Logout functionality"
    echo ""
    echo "🎤 Speech Recognition:"
    echo "  □ Navigate to Practice page"
    echo "  □ Click microphone button"
    echo "  □ Allow microphone permissions"
    echo "  □ Speak and verify transcription appears"
    echo "  □ Check confidence score display"
    echo ""
    echo "⚙️ User Preferences:"
    echo "  □ Access Settings/Profile page"
    echo "  □ Change language settings"
    echo "  □ Modify speech provider preferences"
    echo "  □ Test privacy mode toggle"
    echo ""
    echo "📊 Database Operations:"
    echo "  □ User data persists after operations"
    echo "  □ Learning progress tracks correctly"
    echo "  □ Session history saves"
    echo ""
    echo "🔄 Caching System:"
    echo "  □ Repeated API calls load faster"
    echo "  □ Offline mode works (disconnect network)"
    echo "  □ Data persists in browser storage"
    echo ""
}

# Main test execution
main() {
    log_info "Starting test suite..."
    
    # Run all test categories
    test_environment
    test_database
    test_backend_api
    test_frontend
    test_speech_capabilities
    test_caching
    test_performance
    test_integration
    
    # Generate final report
    generate_report
    
    # Show manual testing steps
    show_manual_tests
}

# Handle script interruption
trap 'log_error "Testing interrupted"; exit 1' INT

# Run main function
main "$@"
SCRIPT_EOF < /dev/null
