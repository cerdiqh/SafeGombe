# Overview

GombeSafe is a real-time security monitoring and incident reporting platform designed specifically for Gombe State, Nigeria. The application provides comprehensive security tracking, community reporting features, and data visualization for local safety conditions. It focuses on addressing specific regional security challenges including terrorism, banditry, cattle rustling, and gang violence (particularly Kalare gangs). The platform operates as a full-stack web application with offline capabilities and real-time data synchronization.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with a custom security-focused design system featuring blue/neutral color scheme
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Maps**: Placeholder implementation for Mapbox GL JS integration (not yet implemented)

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful API architecture with structured error handling
- **Development Server**: Custom Vite integration for hot module replacement in development
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless integration
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Local Storage**: Browser localStorage for offline incident caching
- **Session Storage**: PostgreSQL-backed session management

## Authentication and Authorization
- **Session-based Authentication**: Express sessions with secure cookie configuration
- **Anonymous Reporting**: Support for anonymous incident reporting with optional user identification
- **Permission Model**: Basic role-based access (currently simplified for community reporting)

## External Dependencies

### Database and Backend Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database queries and schema management
- **Express.js**: Web application framework with middleware support

### Frontend Libraries and UI
- **Shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible component primitives (dialogs, forms, navigation)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Data fetching and caching library

### Development and Build Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment with specific Replit plugins

### Maps and Geolocation
- **Mapbox GL JS**: Planned integration for interactive security maps (referenced but not implemented)
- **Browser Geolocation API**: Native geolocation for incident reporting
- **Coordinate System**: WGS84 (latitude/longitude) for location data

### Progressive Web App Features
- **Service Worker**: Offline functionality with background sync capabilities
- **Web App Manifest**: PWA configuration for mobile app-like experience
- **IndexedDB**: Planned for offline data storage (referenced in service worker)

### Real-time Data and APIs
- **REST API**: Custom Express endpoints for incident and security area management
- **Real-time Updates**: Polling-based updates (WebSocket integration not implemented)
- **Offline Sync**: Service worker background sync for offline incident reports