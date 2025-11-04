# Terrawise Real Estate Landing Page

## Overview

This is a full-stack real estate application built for Terrawise, a land development company in Bangalore. The application features a modern React frontend with a Node.js/Express backend, showcasing residential plot developments with inquiry management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Admin Access

Admin login credentials for development:
- Email: admin@terrawise.com
- Password: admin123
- Access URL: /admin-login

Note: Admin panel is fully secured with session-based authentication. Only authorized users with valid credentials can access customer data and lead management features.

## Recent Changes (July 2025)

✓ Completely replaced OTP authentication with simple phone + password authentication
✓ Added password field to marketing agent registration form (required field)
✓ Updated database schema to include password field with secure bcrypt-style hashing
✓ Implemented password authentication in both MemStorage and DatabaseStorage
✓ Fixed database schema conflicts by removing old password_hash and username columns
✓ Successfully tested complete registration and login flow with JSON responses
✓ Added "Back to Home" navigation button to agent login page
✓ Marketing agents auto-approved upon registration for immediate access
✓ Resolved all authentication errors - system fully functional with phone + password login
✓ Fixed enquiry popup to create site visit enquiries instead of general enquiries
✓ Updated admin dashboard tab naming: "Contacts - General Enquiries" for clarity
✓ Enquiry popup submissions now appear in Site Visits tab as requested
✓ CRITICAL FIX: Corrected all form routing issues to ensure proper enquiry categorization:
  - Enquiry popup → Site Visit Enquiries tab ✅
  - Contact section "Schedule Site Visit" → Site Visit Enquiries tab ✅
  - Project details "Book Site Visit" → Site Visit Enquiries tab ✅
  - Construction services consultation → Construction Services tab ✅
✓ Enhanced professional communication across all popups:
  - All popups now require name field for professional interaction
  - Site Visit Popup: Full Name field ✅
  - General Enquiry Popup: Name field ✅  
  - Consultation Popup: Full Name field ✅
✓ Improved admin panel information display for complete transparency:
  - Construction Services: Shows service type, project details, budget, timeline
  - Site Visits: Shows project name, email, marketing agent, message
  - General Enquiries: Shows purpose with clear labeling
  - All enquiry types display comprehensive information with bold labels

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful endpoints with JSON responses
- **Development**: Hot reloading with Vite integration

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: Concurrent frontend/backend development with proxy setup

## Key Components

### Database Schema
- **Projects Table**: Stores property development information including name, location, pricing, status, and amenities
- **Inquiries Table**: Customer inquiry form submissions with contact details, project interest, and marketing agent referrals
- **Marketing Agents Table**: Agent registration data including personal details, banking information, and status
- **Testimonials Table**: Customer reviews and ratings

### Marketing Agent Features
- **Agent Registration**: Complete onboarding form with personal and banking details
- **Agent Dashboard**: Login system with lead tracking and status management
- **Lead Referral System**: Customers can reference agents when making inquiries
- **Commission Tracking**: Admin can view agent performance and lead conversion
- **Status Management**: Multi-level approval system (pending, active, inactive, rejected)

### Core Features
1. **Project Showcase**: Display available residential developments with filtering
2. **Inquiry System**: Lead capture forms with validation and email notifications
3. **Admin Panel**: Complete inquiry management system for viewing and managing customer leads
4. **Marketing Agent System**: Complete agent registration, dashboard, and lead tracking
5. **Testimonials**: Customer review display system
6. **About Us**: Comprehensive company information with mission, vision, and values
7. **Development Process**: Educational content about land development stages
8. **Contact Integration**: Multiple contact channels (phone, WhatsApp, form)

### UI Components
- Responsive navigation with mobile menu
- Hero section with background images
- Project cards with status badges and filtering
- Contact forms with real-time validation
- Floating action buttons for quick contact
- Trust indicators and statistics

## Data Flow

### Frontend to Backend
1. React components fetch data using TanStack Query
2. Custom `apiRequest` utility handles HTTP requests with error handling
3. Form submissions use mutations for server updates
4. Toast notifications provide user feedback

### Backend Data Management
1. Express routes handle API endpoints (`/api/projects`, `/api/inquiries`)
2. Storage layer abstracts database operations
3. PostgreSQL database with Drizzle ORM for type-safe database queries
4. DatabaseStorage implementation for persistent data storage

### Validation Pipeline
1. Zod schemas define data structure and validation rules
2. Frontend forms validate on client-side using react-hook-form
3. Backend validates requests using same Zod schemas
4. Database constraints ensure data integrity

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Form and Validation
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation
- **@hookform/resolvers**: Form validation integration

### Database and Backend
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **Express**: Web framework for Node.js

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle handles schema migrations

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development/production mode detection
- Replit-specific optimizations for cloud deployment

### Development Workflow
1. `npm run dev`: Starts development server with hot reload
2. `npm run build`: Builds both frontend and backend for production
3. `npm run start`: Runs production build
4. `npm run db:push`: Applies database schema changes

The application is designed for deployment on platforms like Replit, with automatic environment detection and optimized build processes for both development and production scenarios.