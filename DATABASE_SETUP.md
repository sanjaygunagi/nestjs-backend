# Database Setup Guide

## 🗄️ **Database Integration**

Your NestJS application now includes **TypeORM** for database operations instead of in-memory storage.

## 📋 **Prerequisites**

1. **PostgreSQL** installed and running
2. **Node.js** and **npm** (already installed)

## ⚙️ **Configuration**

### 1. Create a `.env` file in your project root:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=nestjs_backend

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 2. Database Setup

#### **Option A: Using Docker (Recommended for development)**

```bash
# Start PostgreSQL container
docker run --name postgres-nestjs \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nestjs_backend \
  -p 5432:5432 \
  -d postgres:15

# Check if container is running
docker ps
```

#### **Option B: Local PostgreSQL Installation**

1. Install PostgreSQL on your system
2. Create a database:
   ```sql
   CREATE DATABASE nestjs_backend;
   CREATE USER postgres WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE nestjs_backend TO postgres;
   ```

## 🚀 **Running the Application**

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   npm run start:dev
   ```

3. **Check database connection**:
   - The application will automatically create the `users` table
   - Check the console logs for database connection status

## 🔍 **What's Different Now**

### **Before (In-Memory)**:
- Data stored in application memory
- Data lost on server restart
- No persistence

### **After (Database)**:
- Data stored in PostgreSQL database
- Data persists between restarts
- Proper ACID transactions
- Concurrent user support
- Data backup and recovery

## 📊 **Database Schema**

The `users` table will be automatically created with:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  dateOfBirth DATE,
  phoneNumber VARCHAR(20),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IDX_users_email ON users(email);
```

## 🧪 **Testing the API**

Once the database is connected, test the API endpoints:

```bash
# Create a user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'

# Get all users
curl http://localhost:3000/api/v1/users
```

## 🔧 **Troubleshooting**

### **Connection Issues**:
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database exists
- Check firewall settings

### **Permission Issues**:
- Verify user has proper database permissions
- Check PostgreSQL `pg_hba.conf` configuration

## 🚀 **Next Steps**

Consider adding:
- **Password Hashing**: Use bcrypt for secure password storage
- **Database Migrations**: For production deployments
- **Connection Pooling**: For better performance
- **Database Backup**: Automated backup strategies
