# LinguaLeap Open-Source Development Stack

## 🏗️ Complete Docker-Based Development Environment

This document outlines our comprehensive open-source development and monitoring stack, all deployable via Docker Desktop with zero licensing costs.

---

## 🛠️ **Development Tools Stack**

### **1. Database & Caching**
- **PostgreSQL 15** - Primary database (Port: 5432)
- **Redis 7** - Caching and session storage (Port: 6379)
- **Adminer** - Database management UI (Port: 8080)
- **RedisInsight** - Redis management UI (Port: 8001)

### **2. Source Code Management & CI/CD**
- **GitLab CE** - Git repository, issue tracking, CI/CD (Port: 8090)
- **GitLab Runner** - CI/CD pipeline execution
- **SonarQube Community** - Code quality analysis (Port: 9000)

### **3. Monitoring & Observability**
- **Prometheus** - Metrics collection (Port: 9090)
- **Grafana** - Monitoring dashboards (Port: 3000)
- **Node Exporter** - System metrics (Port: 9100)
- **cAdvisor** - Container metrics (Port: 8080)
- **Jaeger** - Distributed tracing (Port: 16686)

### **4. Logging Stack (ELK)**
- **Elasticsearch** - Log storage and search (Port: 9200)
- **Logstash** - Log processing pipeline (Port: 5044)
- **Kibana** - Log visualization (Port: 5601)

### **5. Infrastructure Services**
- **MinIO** - S3-compatible object storage (Port: 9000/9001)
- **Nginx** - Reverse proxy and load balancer (Port: 80/443)
- **Portainer** - Docker container management (Port: 9443)
- **OpenAI Whisper API** - Self-hosted speech-to-text (Port: 9999)

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
```bash
# Install Docker Desktop
# Ensure you have at least 8GB RAM and 20GB disk space
# Enable WSL2 on Windows or ensure Docker has adequate resources
```

### **1. Start the Complete Stack**
```bash
# Clone the repository
cd C:\Users\ajayd\IdeaProjects\language-lab

# Start all services
docker-compose -f docker-compose.development.yml up -d

# Check service status
docker-compose -f docker-compose.development.yml ps
```

### **2. Initialize Services**
```bash
# Wait for all services to be healthy
docker-compose -f docker-compose.development.yml logs -f

# Services will auto-configure on first run
# Check health status
docker-compose -f docker-compose.development.yml exec postgres pg_isready
docker-compose -f docker-compose.development.yml exec redis redis-cli ping
```

---

## 🎯 **Service Access URLs**

### **Development Tools**
| Service | URL | Credentials |
|---------|-----|-------------|
| **GitLab CE** | http://localhost:8090 | root / (set on first login) |
| **SonarQube** | http://localhost:9000 | admin / admin |
| **Adminer** | http://localhost:8080 | lingualeap / dev_password_2024 |
| **RedisInsight** | http://localhost:8001 | Connect to redis:6379 |

### **Monitoring & Observability**
| Service | URL | Credentials |
|---------|-----|-------------|
| **Grafana** | http://localhost:3000 | admin / grafana_admin_2024 |
| **Prometheus** | http://localhost:9090 | No auth |
| **Jaeger** | http://localhost:16686 | No auth |
| **Kibana** | http://localhost:5601 | No auth |

### **Infrastructure**
| Service | URL | Credentials |
|---------|-----|-------------|
| **Portainer** | https://localhost:9443 | (set on first login) |
| **MinIO Console** | http://localhost:9001 | lingualeap / minio_password_2024 |
| **Whisper API** | http://localhost:9999 | No auth |

---

## 📊 **Monitoring Setup**

### **Grafana Dashboards** (Auto-provisioned)
- **Application Metrics**: Request rates, response times, error rates
- **Infrastructure Monitoring**: CPU, memory, disk usage
- **Database Performance**: PostgreSQL queries, connections, locks
- **Redis Metrics**: Cache hit rates, memory usage, connections
- **Container Metrics**: Docker container resource usage

### **Prometheus Targets** (Auto-configured)
- Node Exporter (system metrics)
- cAdvisor (container metrics)
- PostgreSQL Exporter
- Redis Exporter
- Application metrics endpoints

### **Logging Pipeline** (ELK Stack)
- **Application Logs**: Structured JSON logging
- **Access Logs**: Nginx request logs
- **Error Logs**: Application error tracking
- **Audit Logs**: Security and compliance tracking

---

## 🔧 **Configuration Files**

### **Required Configuration Files**
```
monitoring/
├── grafana/
│   ├── dashboards/
│   └── datasources/
├── prometheus/
│   ├── prometheus.yml
│   └── rules/
└── logstash/
    ├── config/
    └── pipeline/

nginx/
├── nginx.conf
└── conf.d/

database/
└── init/
    └── 01-init-databases.sql
```

### **Environment Variables**
```bash
# Database
POSTGRES_DB=lingualeap_dev
POSTGRES_USER=lingualeap
POSTGRES_PASSWORD=dev_password_2024

# Redis
REDIS_PASSWORD=redis_dev_2024

# Grafana
GF_SECURITY_ADMIN_PASSWORD=grafana_admin_2024

# MinIO
MINIO_ROOT_USER=lingualeap
MINIO_ROOT_PASSWORD=minio_password_2024
```

---

## 🛡️ **Security Configuration**

### **Network Security**
- Isolated Docker network (172.20.0.0/16)
- Service-to-service communication only within network
- External access only through defined ports

### **Authentication**
- Strong passwords for all services
- PostgreSQL database authentication
- Redis password protection
- Grafana admin authentication

### **Data Protection**
- Persistent volumes for data storage
- Database backup strategies
- Log retention policies

---

## 📈 **Performance Optimization**

### **Resource Allocation**
```yaml
# Recommended Docker Desktop Settings
CPU: 4+ cores
Memory: 8GB+ RAM
Disk: 50GB+ available space
```

### **Service Resource Limits**
- **PostgreSQL**: 2GB memory, 2 CPU cores
- **Elasticsearch**: 512MB JVM heap
- **Redis**: 256MB memory limit
- **Grafana**: 512MB memory limit

---

## 🔄 **CI/CD Pipeline Integration**

### **GitLab CI/CD** (.gitlab-ci.yml)
```yaml
stages:
  - test
  - quality
  - build
  - deploy

variables:
  POSTGRES_HOST: postgres
  REDIS_HOST: redis
  SONAR_HOST: sonarqube

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
```

---

## 📋 **Maintenance Commands**

### **Start/Stop Services**
```bash
# Start all services
docker-compose -f docker-compose.development.yml up -d

# Stop all services
docker-compose -f docker-compose.development.yml down

# Restart specific service
docker-compose -f docker-compose.development.yml restart postgres

# View service logs
docker-compose -f docker-compose.development.yml logs -f grafana
```

### **Database Operations**
```bash
# Database backup
docker-compose -f docker-compose.development.yml exec postgres pg_dump -U lingualeap lingualeap_dev > backup.sql

# Database restore
docker-compose -f docker-compose.development.yml exec postgres psql -U lingualeap lingualeap_dev < backup.sql

# Redis operations
docker-compose -f docker-compose.development.yml exec redis redis-cli --scan
```

### **Monitoring Health Checks**
```bash
# Check all service health
docker-compose -f docker-compose.development.yml ps

# Service-specific health
docker-compose -f docker-compose.development.yml exec postgres pg_isready
docker-compose -f docker-compose.development.yml exec redis redis-cli ping
```

---

## 🎯 **Team Onboarding**

### **For lingualeap-tech-lead**
1. Access GitLab: http://localhost:8090
2. Set up project repository and CI/CD pipelines
3. Configure SonarQube quality gates
4. Set up Grafana monitoring dashboards

### **For lingualeap-ui-developer**
1. Access development database via Adminer
2. Set up frontend build and test pipelines
3. Configure performance monitoring for React app
4. Set up accessibility testing in CI/CD

### **For lingualeap-backend-architect**
1. Set up database schemas in PostgreSQL
2. Configure Redis caching strategies  
3. Set up Whisper API integration
4. Configure distributed tracing with Jaeger

---

## 💰 **Cost Analysis**

### **Total Cost: $0/month** 
- All services are open-source and free
- Only cost is compute resources (your development machine)
- No licensing fees or subscription costs
- Enterprise-grade capabilities at zero cost

### **Resource Usage**
- **RAM**: ~6-8GB total usage
- **CPU**: 2-4 cores recommended
- **Storage**: ~10-20GB for all services and data
- **Network**: Internal Docker network only

---

This comprehensive open-source stack provides enterprise-grade development, monitoring, and CI/CD capabilities without any licensing costs, perfect for the LinguaLeap project requirements!