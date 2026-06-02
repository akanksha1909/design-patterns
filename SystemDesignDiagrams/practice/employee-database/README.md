# Employee Database

This project demonstrates an employee database management system using TypeScript, Knex.js, and PostgreSQL.

## Setup

1. **Install PostgreSQL** and ensure it's running on localhost:5432.

2. **Create the database**:
   ```sql
   CREATE DATABASE employee_db;
   ```

3. **Update database credentials** in `knexfile.js`:
   ```javascript
   connection: {
     host: 'localhost',
     port: 5432,
     user: 'postgres',
     password: 'your_actual_password',
     database: 'employee_db'
   }
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Run migrations** to create tables:
   ```bash
   npm run migrate:latest
   ```

6. **Build and run**:
   ```bash
   npm start
   ```

## Database Schema

- **employees**: Stores employee information (id, name, position, type)
- **employee_relationships**: Stores manager-subordinate relationships

## Features

- Add manager and individual employees
- Establish hierarchical relationships
- Retrieve all subordinates for a manager (including indirect ones)