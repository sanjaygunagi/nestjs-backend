# Production Environment Configuration

## 🚀 **Production-Ready Environment Variables**

Create a `.env` file in your project root with the following configuration:

### **Core Application**
```bash
# Application Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
LOG_FORMAT=json
```

### **Database Configuration**
```bash
# Database Configuration
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-secure-db-password
DB_NAME=your-db-name
```

### **JWT Security (CRITICAL - Change These!)**
```bash
# JWT Configuration - CHANGE THESE IN PRODUCTION!
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### **Security Settings**
```bash
# Security Configuration
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### **Rate Limiting**
```bash
# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### **Caching**
```bash
# Caching Configuration
CACHE_TTL=300
CACHE_MAX=1000
```

## 🔐 **Security Best Practices**

### **1. JWT Secret**
- Use a **minimum 32-character random string**
- Generate using: `openssl rand -base64 32`
- **NEVER commit to version control**

### **2. Database Security**
- Use **strong passwords** (16+ characters)
- Enable **SSL connections**
- Use **connection pooling**
- Implement **database backup strategy**

### **3. Environment Isolation**
- Use **different databases** for dev/staging/prod
- **Never share** production credentials
- Use **secrets management** services

## 🐳 **Docker Production Setup**

### **Docker Compose for Production**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 📊 **Production Monitoring**

### **Health Checks**
- Application health: `/api/v1/health`
- Database health: `/api/v1/health/db`
- Cache health: `/api/v1/health/cache`

### **Logging**
- Structured JSON logging
- Log rotation and archiving
- Centralized log aggregation

### **Metrics**
- Request/response times
- Error rates
- Database query performance
- Memory and CPU usage

## 🚨 **Production Checklist**

### **Before Deployment**
- [ ] **Environment variables** configured
- [ ] **JWT secrets** changed from defaults
- [ ] **Database credentials** secured
- [ ] **CORS origins** restricted to production domains
- [ ] **Rate limiting** configured appropriately
- [ ] **Logging level** set to production
- [ ] **Health checks** implemented
- [ ] **Error handling** configured

### **Security Verification**
- [ ] **HTTPS only** in production
- [ ] **Security headers** enabled (Helmet)
- [ ] **Input validation** working
- [ ] **Authentication** tested
- [ ] **Authorization** tested
- [ ] **Rate limiting** tested
- [ ] **SQL injection** protection verified

### **Performance Verification**
- [ ] **Database indexes** created
- [ ] **Connection pooling** configured
- [ ] **Caching** implemented
- [ ] **Compression** enabled
- [ ] **Response times** acceptable

## 🔧 **Deployment Commands**

### **Build for Production**
```bash
npm run build
```

### **Start Production Server**
```bash
npm run start:prod
```

### **Docker Production Build**
```bash
docker build -t nestjs-production .
docker run -p 3000:3000 --env-file .env nestjs-production
```

## 📚 **Additional Resources**

- **NestJS Production Guide**: https://docs.nestjs.com/deployment
- **Security Best Practices**: https://owasp.org/www-project-top-ten/
- **PostgreSQL Production Tuning**: https://www.postgresql.org/docs/current/runtime-config.html
- **JWT Security**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/
