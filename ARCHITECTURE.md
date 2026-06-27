# Production-Grade CMS Architecture

## 🏗️ New Architecture Overview

This document describes the refactored production-grade architecture for the portfolio CMS system.

---

## 📁 Folder Structure

```
dr_portfolio/
├── apps/
│   ├── web/                    # Public website (React + TypeScript + Vite)
│   │   └── src/
│   │       ├── features/       # Feature-based components
│   │       ├── pages/          # Page components
│   │       ├── components/     # Shared UI components
│   │       └── data/           # Static data files
│   │
│   └── admin/                  # NEW: Separate CMS admin panel
│       ├── src/
│       │   ├── components/     # Reusable admin components
│       │   │   ├── Layout.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── Topbar.tsx
│       │   ├── pages/          # Admin editor pages
│       │   │   ├── Login.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── HeroEditor.tsx
│       │   │   ├── StoryEditor.tsx
│       │   │   ├── EcosystemEditor.tsx
│       │   │   ├── EducationEditor.tsx
│       │   │   ├── AwardsEditor.tsx
│       │   │   ├── ContactEditor.tsx
│       │   │   ├── MediaEditor.tsx
│       │   │   └── LeadershipEditor.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── cms/                # NEW: Domain-based CMS modules
│   │   │   ├── shared/         # Shared utilities
│   │   │   │   ├── middleware/
│   │   │   │   │   └── validation.middleware.js
│   │   │   │   ├── services/
│   │   │   │   │   └── base.service.js
│   │   │   │   └── validations/
│   │   │   │       └── common.validation.js
│   │   │   │
│   │   │   ├── hero/           # Hero section domain
│   │   │   │   ├── controllers/
│   │   │   │   │   └── hero.controller.js
│   │   │   │   ├── services/
│   │   │   │   │   └── hero.service.js
│   │   │   │   ├── routes/
│   │   │   │   │   └── hero.routes.js
│   │   │   │   └── validations/
│   │   │   │       └── hero.validation.js
│   │   │   │
│   │   │   ├── story/          # Story section domain
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── routes/
│   │   │   │   └── validations/
│   │   │   │
│   │   │   ├── ecosystem/      # Ecosystem section domain
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── routes/
│   │   │   │   └── validations/
│   │   │   │
│   │   │   ├── education/      # Education section domain
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── routes/
│   │   │   │   └── validations/
│   │   │   │
│   │   │   ├── awards/         # Awards section domain
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── routes/
│   │   │   │   └── validations/
│   │   │   │
│   │   │   ├── contact/        # Contact section domain
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── routes/
│   │   │   │   └── validations/
│   │   │   │
│   │   │   ├── media/          # Media section domain
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── routes/
│   │   │   │   └── validations/
│   │   │   │
│   │   │   └── leadership/     # Leadership section domain
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       ├── routes/
│   │   │       └── validations/
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── contact.routes.js
│   │   │   ├── hero.routes.js
│   │   │   └── impact.routes.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── utils/
│   │   │   ├── asyncHandler.js
│   │   │   └── validationHandler.js
│   │   │
│   │   ├── prisma.js
│   │   └── server.js            # Main server entry point
│   │
│   └── prisma/
│       └── schema.prisma        # Database schema
│
└── package.json                 # Root package.json (if using monorepo)
```

---

## 🔑 Key Architecture Principles

### 1. **Separation of Concerns**

- **Frontend (apps/web)**: Public-facing website
- **Admin (apps/admin)**: Separate CMS dashboard application
- **Backend (backend)**: API server with domain-driven structure

### 2. **Domain-Driven Design**

Each CMS section is a separate domain module with:

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic layer
- **Routes**: API endpoint definitions
- **Validations**: Input validation schemas

### 3. **API-First Approach**

- All data operations go through `/api/cms/*` endpoints
- Admin panel NEVER touches database directly
- Clean separation between frontend and backend

### 4. **Clean Architecture Layers**

```
┌─────────────────────────────────────────┐
│         Admin Panel (apps/admin)        │
│   React + TypeScript + Vite + Tailwind  │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               ↓
┌─────────────────────────────────────────┐
│      Backend API (backend/src)          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Routes Layer                     │  │
│  │  - Define endpoints               │  │
│  │  - Apply middleware               │  │
│  └──────────────┬────────────────────┘  │
│                 │                       │
│  ┌──────────────▼────────────────────┐  │
│  │  Controllers Layer                │  │
│  │  - Handle requests                │  │
│  │  - Return responses               │  │
│  └──────────────┬────────────────────┘  │
│                 │                       │
│  ┌──────────────▼────────────────────┐  │
│  │  Services Layer                   │  │
│  │  - Business logic                 │  │
│  │  - Data operations                │  │
│  └──────────────┬────────────────────┘  │
│                 │                       │
│  ┌──────────────▼────────────────────┐  │
│  │  Prisma ORM                       │  │
│  │  - Database queries               │  │
│  └──────────────┬────────────────────┘  │
│                 │                       │
└─────────────────┼───────────────────────┘
                  │
                  ↓
        ┌──────────────────┐
        │   MySQL Database │
        └──────────────────┘
```

---

## 🚀 API Endpoints

### Hero Section

- `GET /api/cms/hero` - Get hero content
- `PUT /api/cms/hero` - Update hero content (auth required)

### Story

- `GET /api/cms/story` - Get story content
- `PUT /api/cms/story` - Update story content (auth required)

### Ecosystem

- `GET /api/cms/ecosystem` - Get ecosystem content
- `PUT /api/cms/ecosystem` - Update ecosystem content (auth required)

### Education

- `GET /api/cms/education` - Get education content
- `PUT /api/cms/education` - Update education content (auth required)

### Awards

- `GET /api/cms/awards` - Get awards content
- `PUT /api/cms/awards` - Update awards content (auth required)

### Contact

- `GET /api/cms/contact/settings` - Get contact settings (public)
- `PUT /api/cms/contact/settings` - Update contact settings (auth required)
- `POST /api/cms/contact/messages` - Get contact messages (auth required)
- `GET /api/cms/contact/messages/:id` - Get single message (auth required)
- `PUT /api/cms/contact/messages/:id` - Update message (auth required)
- `DELETE /api/cms/contact/messages/:id` - Delete message (auth required)

### Media

- `GET /api/cms/media` - Get media content
- `PUT /api/cms/media` - Update media content (auth required)

### Leadership

- `GET /api/cms/leadership` - Get leadership content
- `PUT /api/cms/leadership` - Update leadership content (auth required)

---

## 🎨 Admin Panel Features

### Modern SaaS Dashboard Design

- **Clean, minimal interface** inspired by Notion/Strapi
- **Glass morphism effects** with soft shadows
- **Smooth transitions** and animations
- **Responsive sidebar** with collapse functionality
- **Top bar** with search, notifications, and user profile

### Key Components

1. **Sidebar**: Navigation menu with all CMS sections
2. **Topbar**: Search, notifications, dark mode toggle, user profile
3. **Dashboard**: Overview stats and quick actions
4. **Editor Pages**: Form-based content editors for each section

### UI/UX Features

- Skeleton loading states
- Toast notifications (ready for implementation)
- Auto-save indicators (ready for implementation)
- Dirty state detection (ready for implementation)
- Modern spacing and typography
- Teal accent color scheme

---

## 🔧 Technology Stack

### Backend

- **Node.js** + **Express.js** - Server framework
- **Prisma** - ORM for database operations
- **MySQL** - Database
- **JWT** - Authentication
- **Joi** - Input validation
- **bcrypt** - Password hashing (ready for implementation)

### Admin Panel

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation
- **Framer Motion** - Animations (ready for implementation)

### Public Website

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Install additional packages for new architecture
npm install express-joi-validation joi

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Admin Panel Setup

```bash
cd apps/admin

# Install dependencies
npm install

# Start development server
npm run dev
# Admin panel will run on http://localhost:3001
```

### Public Website Setup

```bash
# From root directory
npm install

# Start development server
npm run dev
# Website will run on http://localhost:5173
```

---

## 🔐 Authentication

### Login Flow

1. Admin enters credentials in login form
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Token stored in localStorage
5. All subsequent requests include `Authorization: Bearer <token>` header

### Protected Routes

All CMS update endpoints require authentication:

```javascript
router.put('/', verifyToken, validateRequest(schema), controller.update)
```

---

## 🗄️ Database Schema

### Key Models

- `hero_section` - Hero content
- `cms_sections` - Generic CMS sections (story, ecosystem, etc.)
- `cms_section_blocks` - Reusable blocks within sections
- `contact_settings` - Contact information
- `contact_messages` - User inquiries
- `identity_items` - Identity/role items
- `timeline_events` - Timeline milestones
- `navigation_items` - Navigation structure

---

## 🎯 Migration from Old Architecture

### Step 1: Backup

```bash
# Backup database
mysqldump -u root -p portfolio_db > backup.sql

# Backup old admin code
cp -r src/admin src/admin_backup
```

### Step 2: Update Backend

1. Old `backend/src/routes/cms.routes.js` replaced with new domain modules
2. All CMS logic moved to `backend/src/cms/` structure
3. Server entry point updated to `backend/src/server.js`

### Step 3: Deploy Admin Panel

1. New admin panel in `apps/admin/`
2. Runs on separate port (3001)
3. Proxies API requests to backend (5000)

### Step 4: Update Environment

```env
# Backend .env
DATABASE_URL="mysql://user:pass@localhost:3306/portfolio_db"
JWT_SECRET="your-secret-key-here"
PORT=5000

# Admin panel vite.config.ts already configured with proxy
```

### Step 5: Test

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start admin panel
cd apps/admin && npm run dev

# Terminal 3: Start public website
npm run dev
```

---

## 🚀 Production Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

### Admin Panel

```bash
cd apps/admin
npm run build
npm run preview
# Or deploy to Vercel/Netlify
```

### Environment Variables (Production)

```env
NODE_ENV=production
DATABASE_URL=mysql://prod_user:pass@host:3306/portfolio_db
JWT_SECRET=complex-production-secret-key
```

---

## 📝 Development Guidelines

### Adding New CMS Section

1. **Create domain module** in `backend/src/cms/new-section/`

   ```
   ├── controllers/
   │   └── new-section.controller.js
   ├── services/
   │   └── new-section.service.js
   ├── routes/
   │   └── new-section.routes.js
   └── validations/
       └── new-section.validation.js
   ```

2. **Register routes** in `backend/src/cms/routes/index.js`

3. **Create editor page** in `apps/admin/src/pages/NewSectionEditor.tsx`

4. **Add to sidebar** in `apps/admin/src/components/Sidebar.tsx`

5. **Add route** in `apps/admin/src/App.tsx`

### Code Style

- Use async/await for all async operations
- Implement proper error handling
- Add Joi validation for all inputs
- Follow controller → service → repository pattern
- Use TypeScript in admin panel
- Use consistent naming conventions

---

## 🐛 Troubleshooting

### MySQL Connection Issues

```bash
# Check MySQL service
sudo systemctl status mysql

# Reset MySQL root password if needed
sudo mysql_secure_installation
```

### Port Conflicts

```bash
# Check what's using port 5000
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### Prisma Issues

```bash
# Reset Prisma
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [Vite](https://vitejs.dev)

---

## ✨ Future Enhancements

- [ ] Auto-save with debounce
- [ ] Version history for content
- [ ] Draft/Publish system
- [ ] Role-based access control
- [ ] Activity logging
- [ ] Media library with upload
- [ ] Rich text editor
- [ ] Drag & drop block reordering
- [ ] Real-time collaboration
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 👥 Team & Contact

For questions or issues with this architecture, please contact the development team.

---

**Last Updated**: 2025
**Version**: 2.0.0
**Status**: Production-Ready ✅
