# 🚀 NestJS Production-Ready Backend

A **production-ready, enterprise-grade** NestJS backend application with comprehensive authentication, authorization, security features, and deployment automation.

## ✨ **Features**

### 🔐 **Security & Authentication**
- **JWT Authentication** with refresh tokens
- **Role-Based Access Control (RBAC)** with admin, moderator, and user roles
- **Password hashing** with bcrypt (12 rounds)
- **Rate limiting** to prevent abuse
- **Security headers** with Helmet
- **Input validation** and sanitization
- **CORS protection** with configurable origins

### 🗄️ **Database & Performance**
- **PostgreSQL** with TypeORM
- **Database migrations** and schema management
- **Connection pooling** for optimal performance
- **Redis caching** for improved response times
- **Query optimization** with proper indexing

### 📊 **Monitoring & Observability**
- **Health checks** for application and database
- **Structured logging** with Winston
- **Performance metrics** and monitoring
- **Error tracking** and alerting
- **Prometheus** and **Grafana** integration

### 🐳 **Production Infrastructure**
- **Docker containerization** with multi-stage builds
- **Docker Compose** for local development and production
- **Automated deployment** scripts with rollback capability
- **Environment configuration** management
- **CI/CD pipeline** ready

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 15+
- Docker & Docker Compose
- Redis (optional, for caching)

### **1. Clone & Install**
```bash
git clone <your-repo>
cd backend
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### **3. Database Setup**
```bash
# Start PostgreSQL with Docker
./start-db.sh

# Or use your existing PostgreSQL instance
```

### **4. Run Application**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🔐 **Authentication Endpoints**

### **Register User**
```bash
POST /api/v1/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### **Login**
```bash
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### **Protected Routes**
```bash
# Include JWT token in Authorization header
Authorization: Bearer <your-jwt-token>

# Get user profile
GET /api/v1/auth/profile

# Refresh token
POST /api/v1/auth/refresh
```

## 🏗️ **Project Structure**

```
src/
├── auth/                 # Authentication & Authorization
│   ├── dto/            # Data Transfer Objects
│   ├── guards/         # Authentication guards
│   ├── strategies/     # Passport strategies
│   └── decorators/     # Custom decorators
├── users/              # User management
│   ├── dto/           # User DTOs
│   ├── entities/      # User entity
│   └── services/      # User business logic
├── config/            # Configuration files
├── feature/           # Example feature module
└── main.ts           # Application entry point
```

## 🐳 **Docker Deployment**

### **Development**
```bash
docker-compose up -d
```

### **Production**
```bash
# Automated deployment
./deploy-production.sh

# Manual deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 **API Documentation**

- **Swagger UI**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/v1/health
- **API Base URL**: http://localhost:3000/api/v1

## 🔧 **Configuration**

### **Environment Variables**
See `PRODUCTION_ENV.md` for complete configuration guide.

### **Key Settings**
- `JWT_SECRET`: **CRITICAL** - Change in production!
- `DB_PASSWORD`: Strong database password
- `ALLOWED_ORIGINS`: CORS origins for production
- `THROTTLE_LIMIT`: Rate limiting configuration

## 🧪 **Testing**

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 **Production Deployment**

### **1. Environment Setup**
```bash
# Create production .env file
cp .env.example .env.prod
# Edit with production values
```

### **2. Deploy**
```bash
# Automated deployment
./deploy-production.sh

# Manual deployment
docker-compose -f docker-compose.prod.yml up -d
```

### **3. Verify**
```bash
# Health check
curl http://localhost:3000/api/v1/health

# API status
curl http://localhost:3000/api/v1
```

## 🔒 **Security Features**

- **JWT with refresh tokens**
- **Role-based access control**
- **Password strength validation**
- **Rate limiting**
- **Security headers (Helmet)**
- **Input validation & sanitization**
- **CORS protection**
- **SQL injection protection**

## 📊 **Monitoring & Health Checks**

- **Application health**: `/api/v1/health`
- **Database health**: `/api/v1/health/db`
- **Cache health**: `/api/v1/health/cache`
- **Prometheus metrics**: `/metrics`
- **Grafana dashboard**: Port 3001

## 🚨 **Production Checklist**

- [ ] **Environment variables** configured
- [ ] **JWT secrets** changed from defaults
- [ ] **Database credentials** secured
- [ ] **CORS origins** restricted
- [ ] **Rate limiting** configured
- [ ] **Logging level** set to production
- [ ] **Health checks** implemented
- [ ] **Security headers** enabled
- [ ] **HTTPS** configured (in production)
- **Database backup** strategy implemented

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify database credentials
   - Check network connectivity

2. **JWT Authentication Failed**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **Rate Limiting Issues**
   - Adjust THROTTLE_LIMIT in .env
   - Check client request patterns
   - Monitor application logs

### **Logs & Debugging**
```bash
# View application logs
docker-compose logs app

# View database logs
docker-compose logs postgres

# Access application shell
docker-compose exec app sh
```

## 📚 **Additional Resources**

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [PostgreSQL Production Tuning](https://www.postgresql.org/docs/current/runtime-config.html)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 **What's Next?**

This application is now **production-ready** with enterprise-grade features. Consider adding:

- **Email verification** for user registration
- **Two-factor authentication (2FA)**
- **Audit logging** for compliance
- **API versioning** strategy
- **Load balancing** for high availability
- **CDN integration** for static assets
- **Automated backups** and disaster recovery
- **Performance monitoring** and alerting

**Ready for production deployment! 🚀**
