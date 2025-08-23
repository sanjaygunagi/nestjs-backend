#!/bin/bash

echo "🐘 Starting PostgreSQL Database for NestJS Backend"
echo "=================================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if container already exists
if docker ps -a --format "table {{.Names}}" | grep -q "postgres-nestjs"; then
    echo "📦 Container 'postgres-nestjs' already exists."
    
    # Check if it's running
    if docker ps --format "table {{.Names}}" | grep -q "postgres-nestjs"; then
        echo "✅ Container is already running!"
        echo "🌐 Database accessible at: localhost:5432"
        echo "📊 Database: nestjs_backend"
        echo "👤 Username: postgres"
        echo "🔑 Password: password"
        echo ""
        echo "🚀 You can now start your NestJS application with: npm run start:dev"
        exit 0
    else
        echo "🔄 Starting existing container..."
        docker start postgres-nestjs
        echo "✅ Container started successfully!"
    fi
else
    echo "🆕 Creating new PostgreSQL container..."
    docker run --name postgres-nestjs \
        -e POSTGRES_PASSWORD=password \
        -e POSTGRES_DB=nestjs_backend \
        -p 5432:5432 \
        -d postgres:15
    
    if [ $? -eq 0 ]; then
        echo "✅ Container created and started successfully!"
    else
        echo "❌ Failed to create container. Please check Docker logs."
        exit 1
    fi
fi

echo ""
echo "🌐 Database accessible at: localhost:5432"
echo "📊 Database: nestjs_backend"
echo "👤 Username: postgres"
echo "🔑 Password: password"
echo ""
echo "⏳ Waiting for database to be ready..."

# Wait for database to be ready
for i in {1..30}; do
    if docker exec postgres-nestjs pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        echo ""
        echo "🚀 You can now start your NestJS application with: npm run start:dev"
        echo ""
        echo "📝 Don't forget to create a .env file with the database configuration!"
        exit 0
    fi
    echo -n "."
    sleep 1
done

echo ""
echo "⚠️  Database might still be starting up. You can try starting your app anyway."
echo "🚀 Start your NestJS application with: npm run start:dev"
