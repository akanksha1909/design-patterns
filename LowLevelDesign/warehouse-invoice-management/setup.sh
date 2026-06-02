#!/bin/bash

# Database setup script for Warehouse Invoice Management System

echo "=== Warehouse Invoice Management System Setup ==="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL and try again."
    exit 1
fi

DB_NAME="warehouse_invoice_db"
DB_USER="postgres"

# Create database if it doesn't exist
echo "📦 Creating database: $DB_NAME"
createdb $DB_NAME 2>/dev/null || echo "ℹ️  Database already exists"

# Install dependencies
echo "📥 Installing npm dependencies..."
npm install

# Run migrations
echo "🔄 Running database migrations..."
npm run migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To run the demo:"
echo "   npm start"
echo ""
echo "📖 For more information, see README.md"
