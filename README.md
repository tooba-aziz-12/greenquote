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

## Architectural Decision Records

### Architecture Decisions

#### Layered Architecture (Route → Service → Repository)

**Alternative considered:** Logic inside route handlers

**Reason:** Separates HTTP concerns, business rules, and persistence responsibilities while keeping the application flow easy to understand, test, and maintain.

---

#### Isolated Pricing Logic

**Alternative considered:** Pricing embedded in routes or repositories

**Reason:** Keeps pricing rules independent from delivery and persistence concerns, making them easier to test, modify, and extend.

---

#### Lightweight Design

**Alternative considered:** DDD / Hexagonal Architecture

**Reason:** The application centers around a single primary aggregate (`Quote`). Introducing additional architectural layers would add complexity without providing meaningful benefits for the assignment's scope.

---

#### Next.js Route Handlers

**Alternative considered:** Traditional MVC Controllers

**Reason:** Aligns naturally with the Next.js App Router model while preserving familiar backend boundaries between request handling, business logic, and data access.

---

#### Service Layer

**Alternative considered:** Direct Route → Repository calls

**Reason:** Provides a dedicated location for orchestration, validation flow, and business rules, while supporting future growth without increasing route complexity.


### Technology Choices

#### Next.js 16

**Alternatives considered:** React + Express, NestJS

**Reason:** Provides a single codebase for both frontend and backend, reducing setup complexity and enabling faster delivery within the assignment timeframe.

---

#### TypeScript

**Alternative considered:** JavaScript

**Reason:** Improves type safety, developer experience, and long-term maintainability while reducing runtime errors.

---

#### Prisma

**Alternatives considered:** TypeORM, Raw SQL

**Reason:** Offers type-safe database access, a straightforward developer experience, and simple migration management.

---

#### SQLite

**Alternative considered:** PostgreSQL

**Reason:** Requires no additional infrastructure setup and is sufficient for the assignment's scale and persistence requirements.

---

#### NextAuth

**Alternative considered:** Custom JWT implementation

**Reason:** Provides production-ready authentication features with minimal boilerplate and well-tested security practices.

---

#### Jest

**Alternative considered:** Vitest

**Reason:** Has a mature ecosystem, extensive documentation, and strong support for unit and integration testing.

### Database Setup

#### Prisma Migrations

**Alternative considered:** `prisma db push`

**Reason:** Provides versioned, reviewable, and reproducible schema changes, making database evolution more predictable and aligned with production deployment practices.

---

#### Seed Script

**Alternative considered:** Manual admin account creation

**Reason:** Enables repeatable environment setup and ensures a consistent administrator account is available for application evaluation and testing.


### Testing Strategy

#### AuthService Unit Tests

**Alternative considered:** Route-only testing

**Reason:** Validates authentication business logic independently of HTTP concerns, allowing failures to be isolated and diagnosed more easily.

---

#### QuoteService Unit Tests

**Alternative considered:** Route-only testing

**Reason:** Verifies pricing and risk calculation logic in isolation, ensuring business rules are tested without dependencies on routing, persistence, or external infrastructure.

---

#### QuoteRepository Integration Test

**Alternative considered:** Mocked repository tests

**Reason:** Validates Prisma mappings, queries, and database persistence behavior against a real SQLite database, providing confidence that the data access layer behaves correctly in practice.

---

#### Quote API Integration Test

**Alternative considered:** Unit-only testing

**Reason:** Verifies that request validation, service orchestration, database persistence, and API responses work together correctly across the full request lifecycle.