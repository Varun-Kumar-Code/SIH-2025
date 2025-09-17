# Overview

This is a full-stack e-commerce application built with React and Express, featuring a product catalog with categories, favorites functionality, and a mobile-first design. The application showcases pottery and ceramic products with search capabilities, category filtering, and an intuitive user interface optimized for mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: TailwindCSS with a custom warm color scheme (earth tones)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with endpoints for products and user management
- **Data Storage**: In-memory storage with plans for PostgreSQL integration via Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Development**: Hot reload with Vite integration for seamless development experience

## Database Schema
- **Users Table**: Basic user authentication with username/password
- **Products Table**: Product catalog with name, description, price, category, images, ratings, and favorites
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Validation**: Zod schemas for type validation and API contract enforcement

## Key Features
- **Product Catalog**: Browse products by category (Pottery, Ceramic, Glaze)
- **Search Functionality**: Real-time search across product names and descriptions
- **Favorites System**: Toggle favorite status for products with optimistic updates
- **Category Filtering**: Filter products by category with dynamic API calls
- **Responsive Design**: Mobile-optimized interface with bottom navigation
- **Type Safety**: End-to-end TypeScript with shared schemas between client and server

## Authentication & Authorization
- Session-based authentication using Express sessions
- Password storage (implementation pending)
- User management with basic CRUD operations
- Protected routes and API endpoints (implementation pending)

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend UI library with hooks and functional components
- **Express**: Node.js web framework for API server
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast build tool and development server

## Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with schema management
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-kit**: Database migration and introspection tools

## UI & Styling
- **Shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Headless UI primitives for accessibility
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## State Management & Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition

## Development & Build Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & class-variance-authority**: Conditional CSS class management
- **nanoid**: Unique ID generation
- **cmdk**: Command palette functionality