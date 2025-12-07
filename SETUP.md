# Setup Guide

This guide will help you set up the Wisp application with authentication, database, and all required services.

## Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database (local or cloud)
- Privy account (for authentication)

## Step 1: Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Privy App ID - Get this from https://dashboard.privy.io
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Database URL - PostgreSQL connection string
# Example for local: postgresql://user:password@localhost:5432/wisp
# Example for cloud (e.g., Supabase): postgresql://user:password@host:5432/dbname
DATABASE_URL=postgresql://user:password@localhost:5432/wisp
```

### Getting Your Privy App ID

1. Go to [https://dashboard.privy.io](https://dashboard.privy.io)
2. Sign up or log in
3. Create a new app
4. Copy the App ID and add it to your `.env` file

### Setting Up PostgreSQL

**Option 1: Local PostgreSQL**
```bash
# Install PostgreSQL (if not already installed)
# On macOS: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql

# Create database
createdb wisp
```

**Option 2: Cloud Database (Recommended)**
- [Supabase](https://supabase.com) - Free tier available
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Railway](https://railway.app) - Easy PostgreSQL hosting

## Step 2: Install Dependencies

```bash
bun install
# or
npm install
```

## Step 3: Set Up Database

1. Generate Prisma Client:
```bash
bun run db:generate
```

2. Push the schema to your database:
```bash
bun run db:push
```

Alternatively, create a migration:
```bash
bun run db:migrate
```

## Step 4: Run the Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: First Login

1. When you first visit the app, you'll be prompted to log in with Privy
2. Use email authentication to create an account
3. Complete the onboarding flow (this will only appear once)
4. Start adding groceries to your inventory!

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun run db:generate` - Generate Prisma Client
- `bun run db:push` - Push schema changes to database
- `bun run db:migrate` - Create and run migrations
- `bun run db:studio` - Open Prisma Studio (database GUI)

## API Routes

The application includes the following API routes:

- `GET /api/groceries` - Get all groceries for the authenticated user
- `POST /api/groceries` - Add a new grocery item
- `DELETE /api/groceries/[id]` - Delete a grocery item
- `PATCH /api/groceries/[id]` - Update a grocery item
- `GET /api/onboarding` - Get onboarding status
- `POST /api/onboarding` - Save onboarding data

All API routes require authentication via Privy.

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if local)
- Check firewall settings (if cloud)

### Privy Authentication Issues
- Verify `NEXT_PUBLIC_PRIVY_APP_ID` is set correctly
- Check that your Privy app is configured for email authentication
- Ensure your app URL is whitelisted in Privy dashboard

### Prisma Issues
- Run `bun run db:generate` after schema changes
- Use `bun run db:push` for development (faster)
- Use `bun run db:migrate` for production (more control)

