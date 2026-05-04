# BetterStack

A full-stack website uptime monitoring platform that continuously checks website health across multiple geographic regions and provides real-time status dashboards to users.

## Features

- **User Authentication**: Sign up and log in with JWT-based authentication.
- **Website Monitoring**: Add websites to monitor with continuous health checks.
- **Real-Time Dashboard**: View website status, search websites, and filter by status.
- **Distributed Monitoring**: Multi-region architecture using Redis Streams for job distribution.
- **Historical Data**: Track response times and monitoring history.
- **Modern UI**: Built with Next.js, Tailwind CSS, and Radix UI components.

## Tech Stack

### Frontend

- Next.js 16
- TypeScript
- Radix UI
- Zustand
- Axios

### Backend

- Express.js
- Node.js
- TypeScript
- Zod
- JWT Authentication

### Database & Infrastructure

- PostgreSQL
- Prisma ORM
- Redis Streams
- Turborepo
- Bun

## Project Structure

```bash
betterstack/
├── apps/
│   ├── web/        # Next.js frontend
│   ├── api/        # Express backend API
│   └── worker/     # Monitoring workers / region services
├── packages/       # Shared packages and utilities
├── prisma/         # Database schema and migrations
├── turbo.json      # Turborepo configuration
└── README.md
```

## Prerequisites

Before getting started, ensure the following are installed:

- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- Redis instance
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/betterstack.git
cd betterstack
```

### 2. Install dependencies

Using Bun:

```bash
bun install
```

Or using npm:

```bash
npm install
```

## Setup

### Database Setup

1. Create a PostgreSQL database, or use a hosted provider like Neon.
2. Update the `DATABASE_URL` in your environment configuration.
3. Ensure your Prisma schema points to the correct database.

### Redis Setup

1. Start a local Redis instance or use a managed Redis service.
2. Update the Redis connection URL in the relevant services.

### Environment Variables

Create `.env` files for the required apps and configure values such as:

```env
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=
```

### Database Migration

```bash
bunx prisma migrate dev
```

Or:

```bash
npx prisma migrate dev
```

## Running the Project

Run the full monorepo with Turborepo:

```bash
bun run dev
```

Or:

```bash
npm run dev
```

### Run services individually

Examples:

```bash
cd apps/web && bun run dev
cd apps/api && bun run dev
cd apps/worker && bun run dev
```

## API Endpoints

### Authentication

- `POST /user/signup` — Register a new user
- `POST /user/signin` — Log in and receive a JWT token

### Websites

- `POST /website` — Add a new website to monitor (requires authentication)
- `GET /websites` — List all user websites with current status (requires authentication)
- `GET /status/:websiteId` — Get status details for a specific website (requires authentication)

## Database Schema

The application uses four primary models:

- **User** — Stores user account and authentication data.
- **Website** — Stores website metadata and ownership.
- **Region** — Represents geographic monitoring regions.
- **WebsiteTick** — Stores individual monitoring results, including response time and status.
