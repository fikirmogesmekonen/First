# PostgreSQL Setup Instructions for ZoSale Backend

## Prerequisites
- PostgreSQL 12 or higher installed
- pgAdmin or psql command-line tool

## Setup Steps

### 1. Create PostgreSQL Database
\`\`\`sql
-- Connect to PostgreSQL as admin
psql -U postgres

-- Create database
CREATE DATABASE zosale_db;
CREATE DATABASE zosale_db_dev;

-- Create user (optional, for security)
CREATE USER zosale_user WITH PASSWORD 'your_secure_password';
ALTER ROLE zosale_user SET client_encoding TO 'utf8';
ALTER ROLE zosale_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE zosale_user SET default_transaction_deferrable TO on;
ALTER ROLE zosale_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE zosale_db TO zosale_user;
GRANT ALL PRIVILEGES ON DATABASE zosale_db_dev TO zosale_user;
\`\`\`

### 2. Update Connection Strings
Edit `appsettings.json` and `appsettings.Development.json`:

**Production (appsettings.json):**
\`\`\`json
"DefaultConnection": "Host=localhost;Port=5432;Database=zosale_db;Username=postgres;Password=your_password;"
\`\`\`

**Development (appsettings.Development.json):**
\`\`\`json
"DefaultConnection": "Host=localhost;Port=5432;Database=zosale_db_dev;Username=postgres;Password=your_password;"
\`\`\`

### 3. Run Entity Framework Migrations
\`\`\`bash
cd backend
dotnet ef migrations add InitialCreate
dotnet ef database update
\`\`\`

### 4. Verify Database
\`\`\`sql
-- Connect to the database
psql -U postgres -d zosale_db

-- List tables
\dt

-- Check services table
SELECT * FROM "Services";
\`\`\`

### 5. Run the Backend
\`\`\`bash
dotnet run
\`\`\`

The API will be available at `https://localhost:5001` with Swagger UI at `https://localhost:5001/swagger`

## Connection String Format
\`\`\`
Host=<server>;Port=<port>;Database=<database>;Username=<user>;Password=<password>;
\`\`\`

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check if port 5432 is accessible
- Verify credentials in connection string

### Migration Errors
- Delete existing migrations if starting fresh
- Run `dotnet ef database drop` to reset
- Then run migrations again

### Permission Denied
- Ensure the PostgreSQL user has proper permissions
- Run the GRANT commands above
