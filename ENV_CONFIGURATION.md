# Environment Configuration

## Docker Environment Setup

This repository uses Docker Compose for containerized development. The environment configuration has been set up as follows:

### Step 1: Copy and configure the .env file
```bash
cp .env.example .env
```

### Step 2: Environment Variables
The `.env` file contains the following configuration:

```bash
# PostgreSQL Database
POSTGRES_DB=datingpulse
POSTGRES_USER=datingpulse
POSTGRES_PASSWORD=datingpulse_secure_password_2024

# PGAdmin
PGADMIN_EMAIL=admin@datingpulse.com
PGADMIN_PASSWORD=pgadmin_secure_password_2024

# Backend Configuration (for reference)
DATABASE_URL=jdbc:postgresql://localhost:5432/datingpulse
JWT_SECRET=datingpulse_jwt_secret_key_very_secure_2024_change_in_production
PORT=8080
```

### Architecture Notes
- This is a **Spring Boot application** with **PostgreSQL** database (not MongoDB)
- The backend uses standard Spring Boot configuration files (`application.properties`)
- The `.env` file is primarily for Docker Compose environment variables
- Backend-specific configuration should be done in the Spring Boot properties files located in `backend/DatingPulse/src/main/resources/`

### Security
- The `.env` file is automatically excluded from Git via `.gitignore`
- Change all passwords and secrets before production deployment
- Use environment variables for production deployment instead of hardcoded values

### Starting the Environment
```bash
docker compose up -d
```

This will start:
- PostgreSQL database on port 5432
- PGAdmin web interface on port 5050