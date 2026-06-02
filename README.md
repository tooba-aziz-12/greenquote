# GreenQuote

GreenQuote is a solar financing quote platform built with Next.js, TypeScript, Prisma, SQLite, and NextAuth.

## Features

* User registration and login
* Generate solar financing quotes
* View personal quote history
* View quote details
* Admin dashboard
* Search quotes by user name or email
* Health check endpoint
* Unit and integration tests

## Tech Stack

* Next.js 16
* TypeScript
* Prisma
* SQLite
* NextAuth
* Jest

## Setup

### Clone Repository

```bash
git clone https://github.com/tooba-aziz-12/greenquote.git
cd greenquote
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret"
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Seed Admin User

```bash
npx prisma db seed
```

Admin credentials:

```text
Email: admin@test.com
Password: admin123
```

### Run Application

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

## Tests

Run all tests:

```bash
npx jest
```

## Docker

Build image:

```bash
docker build -t greenquote .
```

Run container:

```bash
docker run \
  -p 3001:3000 \
  -e DATABASE_URL="file:./dev.db" \
  -e AUTH_SECRET="your-secret" \
  greenquote
```

Application:

```text
http://localhost:3001
```

## API Endpoints

```text
POST   /api/auth/register
POST   /api/quotes
GET    /api/quotes
GET    /api/quotes/{id}
GET    /api/admin/quotes
GET    /api/health
```

## Architecture

```text
app/
├── api/
├── auth/
├── quotes/
├── lib/

auth/
├── auth.service.ts
└── user.repository.ts

quotes/
├── quote.service.ts
├── quote.repository.ts
├── quote.validator.ts
└── quote.types.ts
```

## Test Coverage

* AuthService unit tests
* QuoteService unit tests
* QuoteRepository integration test
* Quote API integration test

```
```
