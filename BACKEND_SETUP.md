# Backend Configuration Setup

## Quick Start

The backend application now starts successfully with the following fixes applied:

### Fixed Issues ✅
- ✅ Database schema validation errors resolved
- ✅ Entity ID mapping corrected for Audio and other entities  
- ✅ Application configuration files created
- ✅ Firebase configuration made optional and graceful
- ✅ Email configuration properties added
- ✅ Multiple profile support (dev, test, prod)

### Configuration Files Required

Copy the template files and configure with your values:

```bash
# Navigate to backend directory
cd backend/DatingPulse/src/main/resources/

# Copy configuration templates
cp application.properties.template application.properties
cp application-dev.properties.template application-dev.properties  
cp application-prod.properties.template application-prod.properties
cp firebase-service-account.json.template firebase-service-account.json
```

### Running the Application

#### Development Mode (recommended for initial setup)
Uses H2 in-memory database and create-drop schema generation:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

#### Development with PostgreSQL  
Uses PostgreSQL with auto-schema creation:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Production Mode
Uses PostgreSQL with schema validation (requires existing database):
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Application Endpoints

Once running, the application provides:
- **API Base**: http://localhost:8080/api/
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

### Key Configuration Options

#### Database
- Set `DB_USERNAME`, `DB_PASSWORD` environment variables
- Default: postgresql://localhost:5432/datingpulse

#### Email (Optional)
- Set `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` for email functionality
- Default: disabled

#### Firebase (Optional)  
- Set `FIREBASE_ENABLED=true` and provide valid firebase-service-account.json
- Default: disabled

#### AWS S3 (Optional)
- Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`
- Default: disabled

### Schema Management

Currently using Hibernate auto-schema generation:
- **Development**: `create-drop` (recreates schema on each start)
- **Production**: `validate` (validates existing schema)

For production deployment, consider:
1. Create Flyway migration files from current schema
2. Set `spring.flyway.enabled=true`
3. Use `validate` mode for schema verification

### Troubleshooting

#### Application won't start:
1. Ensure PostgreSQL is running (for dev/prod profiles)
2. Check database credentials in environment variables
3. Use test profile for H2 in-memory database

#### Database errors:
1. Use `create-drop` mode to regenerate schema
2. Check entity mappings if custom schema required

#### Firebase errors:
1. Set `app.notifications.push.enabled=false` to disable
2. Provide valid service account JSON file

### Security Notes

Configuration files containing credentials are excluded from git:
- `application.properties`
- `application-dev.properties` 
- `application-prod.properties`
- `firebase-service-account.json`

Always use environment variables for production deployment.