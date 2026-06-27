# Quick Start Guide

## 🔐 ADMIN PASSWORD

**Email:** `admin@example.com`
**Password:** `admin123`

---

## ⚡ FASTEST WAY TO START

### Step 1: Open Terminal and run these commands ONE BY ONE:

```bash
# 1. Go to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Generate Prisma
npm run prisma:generate

# 4. Create database tables
npm run prisma:migrate

# 5. Create admin user
npm run seed

# 6. Start backend server (keep this running)
npm run dev
```

**Leave that terminal running!** You should see: `Server running on http://localhost:5000`

---

### Step 2: Open a NEW terminal window/tab

```bash
# 1. Go to admin panel folder
cd apps/admin

# 2. Install dependencies
npm install

# 3. Start admin panel (keep this running too)
npm run dev
```

**Leave this terminal running too!** You should see something like: `Local: http://localhost:3001/`

---

### Step 3: Open your browser

Go to: **http://localhost:3001**

Login with:

- **Email:** `admin@example.com`
- **Password:** `admin123`

---

## ❌ IF "npm run dev" IS NOT WORKING

### Check 1: Are you in the right folder?

```bash
# You should see these files:
ls backend/package.json
ls apps/admin/package.json

# If not, navigate to the correct folder:
cd /home/sinux/Projects/dr_portfolio/backend
```

### Check 2: Is Node.js installed?

```bash
node --version
# Should show: v18.0.0 or higher
```

### Check 3: Are dependencies installed?

```bash
cd backend
ls node_modules
# Should show a list of folders

# If empty or missing:
npm install
```

### Check 4: Is MySQL running?

```bash
sudo systemctl status mysql
# Should show: active (running)

# If not running:
sudo systemctl start mysql
```

### Check 5: Does .env file exist?

```bash
cd backend
cat .env
# Should show DATABASE_URL, JWT_SECRET, PORT, NODE_ENV
```

---

## 🔧 MANUAL FIX IF NEEDED

### Fix 1: Clean install backend

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Fix 2: Clean install admin panel

```bash
cd apps/admin
rm -rf node_modules package-lock.json
npm install
```

### Fix 3: Reset database

```bash
cd backend
mysql -u root -e "DROP DATABASE IF EXISTS dr_portfolio;"
mysql -u root -e "CREATE DATABASE dr_portfolio;"
npm run prisma:migrate
npm run seed
```

---

## 📋 COMPLETE CHECKLIST

- [ ] Node.js 18+ installed (`node --version`)
- [ ] MySQL running (`sudo systemctl start mysql`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Admin dependencies installed (`cd apps/admin && npm install`)
- [ ] `.env` file exists in backend folder
- [ ] Database created (`npm run prisma:migrate`)
- [ ] Admin user created (`npm run seed`)
- [ ] Backend running on http://localhost:5000
- [ ] Admin panel running on http://localhost:3001
- [ ] Can login with admin@example.com / admin123

---

## 🆘 STILL NOT WORKING?

### Show me the error:

1. **Copy the error message** from your terminal
2. **Tell me which command** you ran
3. **Tell me which folder** you're in (`pwd`)

Common errors:

- `Cannot find module` → Run `npm install` again
- `ECONNREFUSED` → MySQL not running, run `sudo systemctl start mysql`
- `401 Unauthorized` → Wrong password, use `admin123`
- `Database not found` → Run `npm run prisma:migrate`

---

## ✅ SUCCESS LOOKS LIKE:

**Terminal 1 (Backend):**

```
Server running on http://localhost:5000
```

**Terminal 2 (Admin):**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3001/
➜  Network: use --host to expose
```

**Browser:**

- You see the CMS login page
- You can login with admin@example.com / admin123
- You see the dashboard with stats

---

**Remember:**

- Email: **admin@example.com**
- Password: **admin123**
- Backend URL: http://localhost:5000
- Admin URL: http://localhost:3001
