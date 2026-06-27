#!/bin/bash

echo "🚀 Setting up Production CMS..."
echo ""

# Check Node version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node --version 2>&1)
echo "Node version: $NODE_VERSION"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
if [ -d "node_modules" ]; then
    echo "⚠️  node_modules exists, reinstalling..."
    rm -rf node_modules package-lock.json
fi
npm install

# Install admin panel dependencies
echo ""
echo "📦 Installing admin panel dependencies..."
cd ../apps/admin
if [ -d "node_modules" ]; then
    echo "⚠️  node_modules exists, reinstalling..."
    rm -rf node_modules package-lock.json
fi
npm install

# Go back to root
cd ../..

# Check if .env exists
echo ""
echo "🔧 Checking environment configuration..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found!"
    echo "📝 Creating backend/.env from template..."
    cat > backend/.env << 'EOF'
DATABASE_URL="mysql://root:@localhost:3306/portfolio_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
EOF
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env and add your MySQL password if you have one"
else
    echo "✅ backend/.env exists"
fi

# Check if MySQL is running
echo ""
echo "🗄️  Checking MySQL..."
if command -v mysql &> /dev/null; then
    if mysql -u root -e "SELECT 1" &> /dev/null; then
        echo "✅ MySQL is running"
        
        # Create database if not exists
        echo "📊 Creating database if needed..."
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS portfolio_db;" 2>/dev/null
        echo "✅ Database ready"
    else
        echo "❌ MySQL is not running or wrong credentials"
        echo "   Start MySQL with: sudo systemctl start mysql"
    fi
else
    echo "⚠️  MySQL not found in PATH"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MySQL is running"
echo "2. Edit backend/.env if you have MySQL password"
echo "3. Run database setup:"
echo "   cd backend && npm run prisma:generate && npm run prisma:migrate && npm run seed"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start admin panel: cd apps/admin && npm run dev"
echo ""
echo "🔐 Admin credentials:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""