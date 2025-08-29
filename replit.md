# Overview

This is a full-stack web application built as an iframe analysis and testing tool. The application allows users to load external websites into iframes and perform various data extraction and security testing operations. It features a React frontend with a modern UI built using shadcn/ui components, and an Express.js backend that serves both the API endpoints and static test pages for iframe testing scenarios.

The tool is designed to help developers and security researchers understand iframe behavior, cross-origin restrictions, and data extraction possibilities from embedded content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and dark theme
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Development**: tsx for TypeScript execution in development
- **Storage**: In-memory storage implementation with interface for future database integration
- **Serving**: Static file serving for production builds and test pages

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: User management system with username/password authentication
- **Migration**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless driver for PostgreSQL connectivity

## Component Architecture
- **Layout**: Three-panel layout with controls sidebar, main iframe viewer, and results panels
- **Reusability**: Modular component structure with shared UI components
- **Testing**: Components designed with test IDs for automated testing
- **Accessibility**: Built on Radix UI for comprehensive accessibility support

## Development Workflow
- **Hot Reloading**: Vite HMR for instant development feedback
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Quality**: ESLint and TypeScript compiler checks
- **Build Process**: Separate client and server builds with optimized output

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **wouter**: Lightweight React routing

## UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility

## Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

## Validation and Forms
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation
- **drizzle-zod**: Database schema to Zod validation integration

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **lucide-react**: Icon library
- **cmdk**: Command palette component