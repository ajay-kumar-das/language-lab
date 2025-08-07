# 🚀 LinguaLeap Development Environment Setup

## Quick Start Guide

### **1. Prerequisites**
```bash
# Ensure Docker Desktop is installed and running
# Minimum requirements:
# - 8GB RAM
# - 50GB available disk space  
# - Docker Desktop with WSL2 (Windows) or Docker for Mac/Linux
```

### **2. Start Complete Development Stack**
```bash
# Navigate to project directory
cd C:\Users\ajayd\IdeaProjects\language-lab

# Start all services (will auto-pull images on first run)
docker-compose -f docker-compose.development.yml up -d

# Check service status
docker-compose -f docker-compose.development.yml ps

# View logs for troubleshooting
docker-compose -f docker-compose.development.yml logs -f
```

### **3. Access Development Dashboard**
Once all services are running, visit: **http://localhost/dashboard**

This provides a central hub with links to all development tools.

---

## 🎯 **Team Onboarding Instructions**

### **For lingualeap-tech-lead:**

#### **1. Initial Setup (30 minutes)**
```bash
# Clone and start environment
git clone <repository-url>
cd language-lab
docker-compose -f docker-compose.development.yml up -d

# Wait for services to initialize (first run takes ~10-15 minutes)
docker-compose -f docker-compose.development.yml logs -f gitlab
```

#### **2. GitLab Setup**
1. Access GitLab: http://localhost:8090
2. Set root password on first login
3. Create LinguaLeap project
4. Configure GitLab Runner for CI/CD
5. Import existing codebase

#### **3. Code Quality Setup**
1. Access SonarQube: http://localhost:9000 (admin/admin)
2. Create LinguaLeap project
3. Generate SonarQube token
4. Configure quality gates for TypeScript/React/Node.js

#### **4. Monitoring Setup**
1. Access Grafana: http://localhost:3000 (admin/grafana_admin_2024)
2. Configure data sources (Prometheus, Elasticsearch)
3. Import pre-built dashboards for application monitoring
4. Set up alerting rules

---

### **For lingualeap-ui-developer:**

#### **1. Frontend Development Setup**
```bash
# Access development database
# Adminer: http://localhost:8080
# Server: postgres, Username: lingualeap, Password: dev_password_2024, Database: lingualeap_dev

# Frontend will run on http://localhost:3000 (when started)
# Nginx reverse proxy available at http://app.localhost
```

#### **2. Performance Monitoring Setup**
1. Configure React DevTools profiler integration
2. Set up Web Vitals monitoring in Grafana
3. Configure accessibility testing in CI/CD pipeline
4. Set up visual regression testing

#### **3. PWA Development Tools**
1. Service Worker testing via Chrome DevTools
2. Lighthouse CI integration for performance audits
3. Web App Manifest validation
4. Push notification testing setup

---

### **For lingualeap-backend-architect:**

#### **1. Database Setup**
```bash
# Database is auto-initialized with schema
# PostgreSQL: localhost:5432
# Username: lingualeap, Password: dev_password_2024
# Database: lingualeap_dev

# Redis Cache: localhost:6379
# Password: redis_dev_2024
```

#### **2. AI Services Integration**
```bash
# Whisper API (Speech-to-Text)
# URL: http://localhost:9999
# Test endpoint: curl -X POST -F "audio=@test.wav" http://localhost:9999/asr

# Configure OpenAI API keys in environment
# Add to .env file when running backend application
```

#### **3. Backend Monitoring**
1. Set up application metrics endpoints (/metrics)
2. Configure Jaeger tracing: http://localhost:16686
3. Set up structured logging to ELK stack
4. Configure database performance monitoring

---

## 🛠️ **Service Configuration**

### **Development Credentials**
| Service | URL | Username | Password |
|---------|-----|----------|----------|
| PostgreSQL | localhost:5432 | lingualeap | dev_password_2024 |
| Redis | localhost:6379 | - | redis_dev_2024 |
| GitLab | http://localhost:8090 | root | (set on first login) |
| SonarQube | http://localhost:9000 | admin | admin |
| Grafana | http://localhost:3000 | admin | grafana_admin_2024 |
| Adminer | http://localhost:8080 | lingualeap | dev_password_2024 |
| MinIO | http://localhost:9001 | lingualeap | minio_password_2024 |
| Portainer | https://localhost:9443 | - | (set on first login) |

### **Service Health Checks**
```bash
# Check all services
docker-compose -f docker-compose.development.yml ps

# Individual service health
docker-compose -f docker-compose.development.yml exec postgres pg_isready
docker-compose -f docker-compose.development.yml exec redis redis-cli ping

# Application health (when running)
curl http://localhost/health
```

---

## 📊 **Monitoring Stack Overview**

### **Grafana Dashboards** (Auto-provisioned)
- **System Overview**: CPU, memory, disk usage
- **Application Metrics**: Request rates, response times, error rates
- **Database Performance**: Query performance, connection pools
- **Redis Metrics**: Cache hit ratios, memory usage
- **Container Health**: Docker container resource usage

### **Log Analysis** (ELK Stack)
- **Application Logs**: Structured JSON logging
- **Access Logs**: HTTP request logs via Nginx
- **Error Tracking**: Application errors and stack traces
- **Audit Logs**: User actions and system events

### **Distributed Tracing** (Jaeger)
- **Request Tracing**: Full request lifecycle tracking
- **Service Dependencies**: Inter-service communication mapping
- **Performance Analysis**: Latency bottleneck identification

---

## 🔧 **Development Workflows**

### **Daily Development Process**
```bash
# 1. Start development environment
docker-compose -f docker-compose.development.yml up -d

# 2. Start application services
# Frontend: npm run dev (port 3000)
# Backend: npm run dev (port 5000)

# 3. Monitor via dashboard
# Visit: http://localhost/dashboard

# 4. Code quality checks
# SonarQube analysis runs automatically on commits

# 5. Performance monitoring
# Grafana dashboards update in real-time
```

### **CI/CD Pipeline** (GitLab)
```yaml
# .gitlab-ci.yml (template)
stages:
  - test
  - quality
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

quality:
  stage: quality
  script:
    - sonar-scanner -Dsonar.host.url=http://sonarqube:9000
    - sonar-quality-gate-check

build:
  stage: build
  script:
    - docker build -t lingualeap:$CI_COMMIT_SHA .
    - docker tag lingualeap:$CI_COMMIT_SHA lingualeap:latest
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Services Not Starting**
```bash
# Check Docker resources
docker system df
docker system prune

# Restart individual services
docker-compose -f docker-compose.development.yml restart postgres
docker-compose -f docker-compose.development.yml restart redis
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.development.yml logs postgres

# Manual connection test
docker-compose -f docker-compose.development.yml exec postgres psql -U lingualeap -d lingualeap_dev -c "SELECT 1;"
```

#### **Memory Issues**
```bash
# Check Docker memory usage
docker stats

# Increase Docker Desktop memory allocation to 8GB+
# Restart services with memory limits
```

### **Service Dependencies**
- PostgreSQL must be ready before SonarQube and Grafana
- Redis must be ready before application services
- Elasticsearch must be ready before Kibana and Logstash

---

## 📈 **Resource Usage**

### **Typical Resource Consumption**
- **Total RAM Usage**: 6-8GB
- **CPU Usage**: 2-4 cores active
- **Disk Usage**: 10-20GB for all containers and data
- **Network**: Internal Docker network only

### **Performance Optimization**
```bash
# Reduce resource usage for development
export COMPOSE_FILE=docker-compose.development.yml
export COMPOSE_PROFILES=minimal  # Starts only essential services

# Start minimal stack (DB, Redis, GitLab, Monitoring)
docker-compose --profile minimal up -d
```

---

## 🎯 **Next Steps**

### **Week 1 Tasks**
1. **Environment Setup**: All team members complete environment setup
2. **Code Repository**: Import existing codebase into GitLab
3. **CI/CD Configuration**: Set up automated testing and quality gates
4. **Monitoring Configuration**: Configure dashboards and alerting

### **Week 2 Tasks**  
1. **Application Setup**: Frontend and backend applications running locally
2. **Database Migration**: Run Prisma migrations and seed data
3. **API Integration**: Connect frontend to backend APIs
4. **Testing Setup**: Unit tests, integration tests, E2E tests configured

This comprehensive development environment provides enterprise-grade tools at zero licensing cost, perfect for the LinguaLeap project's requirements! 🚀