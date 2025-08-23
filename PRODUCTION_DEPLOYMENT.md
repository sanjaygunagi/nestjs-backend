# 🚀 Production Deployment Guide

This guide will walk you through deploying your NestJS application to production with enterprise-grade security and performance.

## 📋 **Prerequisites**

### **Required Tools**
- Docker & Docker Compose
- Git
- SSH access to production server
- Domain name (for production)
- SSL certificate (Let's Encrypt recommended)

### **Server Requirements**
- **CPU**: 2+ cores (4+ recommended)
- **RAM**: 4GB+ (8GB+ recommended)
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Network**: Public IP with ports 80, 443, 3000 open

## 🔧 **Step 1: Server Preparation**

### **Update System**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### **Install Docker**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### **Install Additional Tools**
```bash
# Install essential tools
sudo apt install -y nginx certbot python3-certbot-nginx ufw htop

# Or for CentOS
sudo yum install -y nginx certbot python3-certbot-nginx firewalld htop
```

## 🔐 **Step 2: Security Configuration**

### **Firewall Setup**
```bash
# Ubuntu
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw enable

# CentOS
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### **SSH Security**
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Add/modify these lines:
Port 2222  # Change default port
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart sshd
```

## 🗄️ **Step 3: Database Setup**

### **Create Database User**
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE nestjs_production;
CREATE USER nestjs_user WITH ENCRYPTED PASSWORD 'your-super-secure-password';
GRANT ALL PRIVILEGES ON DATABASE nestjs_production TO nestjs_user;
ALTER USER nestjs_user CREATEDB;
\q
```

### **Database Security**
```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/15/main/postgresql.conf

# Add these lines:
listen_addresses = 'localhost'
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB

# Edit pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Ensure only local connections:
local   all             postgres                                peer
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

## 📁 **Step 4: Application Deployment**

### **Clone Repository**
```bash
# Create app directory
sudo mkdir -p /opt/nestjs-app
sudo chown $USER:$USER /opt/nestjs-app
cd /opt/nestjs-app

# Clone your repository
git clone <your-repo-url> .
```

### **Environment Configuration**
```bash
# Copy environment template
cp env.template .env

# Edit with production values
nano .env

# Critical settings to change:
NODE_ENV=production
DB_HOST=localhost
DB_PASSWORD=your-super-secure-password
JWT_SECRET=your-generated-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### **Generate Secure JWT Secret**
```bash
# Generate a secure secret
openssl rand -base64 32

# Add to .env file
JWT_SECRET=your-generated-secret-here
```

### **Deploy Application**
```bash
# Make deployment script executable
chmod +x deploy-production.sh

# Run deployment
./deploy-production.sh
```

## 🌐 **Step 5: Nginx Configuration**

### **Create Nginx Config**
```bash
sudo nano /etc/nginx/sites-available/nestjs-app
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy to NestJS app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000/api/v1/health;
        access_log off;
    }
}
```

### **Enable Site**
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/nestjs-app /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔒 **Step 6: SSL Certificate**

### **Obtain SSL Certificate**
```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start Nginx
sudo systemctl start nginx
```

### **Auto-renewal Setup**
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 **Step 7: Monitoring Setup**

### **Prometheus Configuration**
```bash
# Create monitoring directory
mkdir -p monitoring

# Create prometheus.yml
nano monitoring/prometheus.yml
```

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nestjs-app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s
```

### **Start Monitoring Services**
```bash
# Start monitoring stack
docker-compose -f docker-compose.prod.yml up -d prometheus grafana

# Access Grafana at http://yourdomain.com:3001
# Default credentials: admin / admin
```

## 🧪 **Step 8: Testing & Verification**

### **Health Checks**
```bash
# Application health
curl -k https://yourdomain.com/api/v1/health

# Database health
curl -k https://yourdomain.com/api/v1/health/db

# API status
curl -k https://yourdomain.com/api/v1
```

### **Authentication Test**
```bash
# Test registration
curl -X POST https://yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@yourdomain.com",
    "password": "SecurePass123!"
  }'

# Test login
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@yourdomain.com",
    "password": "SecurePass123!"
  }'
```

## 🔄 **Step 9: CI/CD Pipeline (Optional)**

### **GitHub Actions Example**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /opt/nestjs-app
            git pull origin main
            ./deploy-production.sh
```

## 🚨 **Step 10: Post-Deployment Checklist**

### **Security Verification**
- [ ] **HTTPS** is working and redirecting HTTP
- [ ] **JWT secrets** are changed from defaults
- **Database credentials** are secure
- **Firewall** is properly configured
- **SSH** is secured (key-based auth only)
- **Security headers** are present

### **Performance Verification**
- [ ] **Database indexes** are created
- **Connection pooling** is working
- **Caching** is implemented
- **Compression** is enabled
- **Response times** are acceptable

### **Monitoring Verification**
- [ ] **Health checks** are responding
- **Logs** are being generated
- **Metrics** are being collected
- **Alerts** are configured
- **Backups** are working

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Application Not Starting**
   ```bash
   # Check logs
   docker-compose logs app
   
   # Check environment variables
   docker-compose exec app env
   ```

2. **Database Connection Failed**
   ```bash
   # Test database connection
   psql -h localhost -U nestjs_user -d nestjs_production
   
   # Check PostgreSQL status
   sudo systemctl status postgresql
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew manually if needed
   sudo certbot renew
   ```

### **Log Locations**
- **Application logs**: `/opt/nestjs-app/logs/`
- **Nginx logs**: `/var/log/nginx/`
- **PostgreSQL logs**: `/var/log/postgresql/`
- **System logs**: `/var/log/syslog`

## 📚 **Additional Resources**

- [NestJS Production Guide](https://docs.nestjs.com/deployment)
- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PostgreSQL Production Tuning](https://www.postgresql.org/docs/current/runtime-config.html)

---

## 🎯 **Next Steps**

Your application is now **production-ready**! Consider implementing:

- **Automated backups** with cron jobs
- **Log aggregation** with ELK stack
- **Load balancing** for high availability
- **CDN integration** for static assets
- **Performance monitoring** with APM tools
- **Security scanning** with automated tools
- **Disaster recovery** procedures

**Congratulations! 🎉 Your NestJS application is now deployed to production with enterprise-grade security and performance.**
