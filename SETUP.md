# Setup Guide - Production CMS

## 🔐 Admin Credentials

**Default Admin Login:**

- **Email:** `admin@example.com`
- **Password:** `admin123`

### How to Check/Reset Admin Password

1. **Check if admin exists:**

   ```bash
   cd backend
   npm run seed
   ```

   This will show you the admin credentials.

2. **Reset admin password manually:**

   ```bash
   # Open MySQL
   mysql -u root -p

   # Select database
   USE portfolio_db;

   # Update password (bcrypt hash for 'admin123')
   UPDATE admin SET password = '$2b$10$rQ7H8p9L2mN3oP4qR5sT6uV7wX8yZ0aB1cD2eF3gH4iJ5kL6mN7oP8'
   WHERE email = 'admin@example.com';
   ```

3. **Create new admin user:**

   ```bash
   node -e "
   const bcrypt = require('bcrypt');
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();

   async function createAdmin() {
     const hash = await bcrypt.hash('yourpassword', 10);
     await prisma.admin.create({
       data: {
         email: 'newadmin@example.com',
         password: hash
       }
     });
     console.log('Admin created!');
     await prisma.\$disconnect();
   }
   createAdmin();
   "
   ```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn

### Step 1: Install Backend Dependencies

```bash
cd backend

# Install all dependencies
npm install

# If you get errors, try:
rm -rf node_modules package-lock.json
npm install
```

### Step 2: Install Admin Panel Dependencies

```bash
cd apps/admin

# Install all dependencies
npm install

# If you get errors, try:
rm -rf node_modules package-lock.json
npm install
```

### Step 3: Setup Environment Variables

Create `backend/.env` file:

```env
DATABASE_URL="mysql://root:@localhost:3306/portfolio_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

**Note:** Replace `root:` with your MySQL password if you have one.

### Step 4: Setup Database

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Seed admin user
npm run seed
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on http://localhost:5000

**Terminal 2 - Admin Panel:**

```bash
cd apps/admin
npm run dev
```

Admin panel will run on http://localhost:3001

**Terminal 3 - Public Website (optional):**

```bash
npm run dev
```

Website will run on http://localhost:5173

---

## 🐛 Common Issues & Solutions

### Issue 1: "npm run dev" not working

**Problem:** Missing dependencies or wrong Node version

**Solution:**

```bash
# Check Node version (should be 18+)
node --version

# If wrong version, install correct version using nvm
nvm install 18
nvm use 18

# Clean install
cd backend
rm -rf node_modules package-lock.json
npm install

# Same for admin panel
cd apps/admin
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: MySQL Connection Error

**Problem:** MySQL not running or wrong credentials

**Solution:**

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Test connection
mysql -u root -p

# If password is empty, use:
mysql -u root
```

### Issue 3: Prisma Migration Errors

**Problem:** Database doesn't exist or schema issues

**Solution:**

```bash
cd backend

# Reset everything (WARNING: deletes all data)
npx prisma migrate reset

# Or create database manually
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS portfolio_db;"

# Then run migrations again
npm run prisma:migrate
```

### Issue 4: Port Already in Use

**Problem:** Port 5000 or 3001 already occupied

**Solution:**

```bash
# Find what's using the port
lsof -i :5000
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change port in .env file
PORT=5001
```

### Issue 5: Admin Login Not Working

**Problem:** Admin user not created or wrong credentials

**Solution:**

```bash
cd backend

# Run seed script
npm run seed

# Check database
mysql -u root -p
USE portfolio_db;
SELECT * FROM admin;

# If no admin exists, create one:
npm run seed
```

---

## 📋 Quick Start Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] MySQL installed and running (`sudo systemctl status mysql`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Admin panel dependencies installed (`cd apps/admin && npm install`)
- [ ] `.env` file created in backend folder
- [ ] Database created (`portfolio_db`)
- [ ] Prisma migrations run (`npm run prisma:migrate`)
- [ ] Admin user seeded (`npm run seed`)
- [ ] Backend server starts (`npm run dev` in backend folder)
- [ ] Admin panel starts (`npm run dev` in apps/admin folder)
- [ ] Can access http://localhost:3001
- [ ] Can login with admin@example.com / admin123

---

## 🔧 Manual Setup (If npm issues persist)

### Backend Setup Without npm

```bash
cd backend

# Install dependencies one by one
npm install express
npm install @prisma/client
npm install prisma
npm install jsonwebtoken
npm install bcrypt
npm install cors
npm install dotenv
npm install joi
npm install express-joi-validation
npm install -D nodemon
```

### Admin Panel Setup Without npm

```bash
cd apps/admin

# Install dependencies one by one
npm install react react-dom
npm install react-router-dom
npm install lucide-react
npm install -D vite @vitejs/plugin-react
npm install -D typescript @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
```

---

## 📞 Getting Help

If you're still having issues:

1. **Check the logs:**
   - Backend logs in terminal where you ran `npm run dev`
   - Admin panel logs in terminal where you ran `npm run dev`

2. **Common error messages:**
   - "Cannot find module" → Run `npm install` again
   - "ECONNREFUSED" → MySQL not running or wrong port
   - "401 Unauthorized" → Wrong admin credentials
   - "Database not found" → Run `npm run prisma:migrate`

3. **Verify installation:**

   ```bash
   # Backend
   cd backend
   npm list

   # Admin
   cd apps/admin
   npm list
   ```

---

## ✅ Verification Steps

1. **Test Backend:**

   ```bash
   curl http://localhost:5000/
   # Should return: {"status":"ok","message":"CMS Backend Running 🚀"}
   ```

2. **Test Admin Login:**

   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   # Should return a token
   ```

3. **Test Admin Panel:**
   - Open http://localhost:3001
   - Login with admin@example.com / admin123
   - Should see dashboard

---

**Last Updated:** 2025
**Status:** Ready for Setup ✅
