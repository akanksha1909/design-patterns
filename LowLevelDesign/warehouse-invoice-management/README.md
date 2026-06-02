# Warehouse Invoice Management System

A TypeScript-based invoice management system for warehouses using PostgreSQL, Knex.js query builder, and the pg driver.

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Update the database connection in `knexfile.ts`:

```typescript
connection: {
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "warehouse_invoice_db",
}
```

Or set environment variables:
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=warehouse_invoice_db
```

### 3. Create Database

```bash
createdb warehouse_invoice_db
```

### 4. Run Migrations

```bash
npm run migrate
```

This will create the `invoices` and `invoice_items` tables.

### 5. Build and Run

```bash
npm start
```

## Available Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run the demo
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback the last migration
- `npm run migrate:make` - Create a new migration file
- `npm run seed` - Run database seeds
- `npm run seed:make` - Create a new seed file

## Project Structure

```
src/
├── database/
│   ├── db.ts              # Database connection
│   └── migrations/        # Migration files
├── entities/
│   ├── Invoice.ts
│   ├── InvoiceItem.ts
├── repositories/
│   └── InvoiceRepository.ts
├── services/
│   └── InvoiceService.ts
├── strategy/
│   └── PricingStrategy.ts
├── enums/
│   └── InvoiceStatus.ts
├── WarehouseInvoiceManager.ts
└── Demo.ts
```

## Database Schema

### invoices table
- `id` (UUID, Primary Key)
- `warehouse_id` (String)
- `customer_id` (String)
- `total` (Decimal)
- `status` (Enum: DRAFT, SENT, PAID, CANCELLED)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### invoice_items table
- `id` (UUID, Primary Key)
- `invoice_id` (UUID, Foreign Key)
- `product_id` (String)
- `quantity` (Integer)
- `unit_price` (Decimal)
- `created_at` (Timestamp)

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Knex.js** - SQL query builder
- **pg** - PostgreSQL client
- **Node.js** - Runtime environment
