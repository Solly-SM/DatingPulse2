# Security & Credential Management

## ⚠️ Important Security Notice

**All credential files have been removed from this repository for security reasons.** 

## Setup Instructions

### 1. Backend Configuration

Navigate to `backend/DatingPulse/src/main/resources/` and copy the template files:

```bash
cd backend/DatingPulse/src/main/resources/
cp application.properties.template application.properties
cp application-dev.properties.template application-dev.properties
cp application-prod.properties.template application-prod.properties
cp firebase-service-account.json.template firebase-service-account.json
```

Then edit each file and replace the placeholder values with your actual credentials:
- Database passwords
- Firebase service account details
- JWT secrets
- Email SMTP credentials
- Redis passwords

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to Project Settings → Service Accounts
4. Generate a new private key
5. Save the JSON file as `firebase-service-account.json` in `backend/DatingPulse/src/main/resources/`

### 3. Docker Environment

Copy the Docker environment template:

```bash
cp .env.example .env
```

Edit `.env` and set your preferred database and PGAdmin passwords.

### 4. Never Commit Credentials

The following files are ignored by Git and should NEVER be committed:
- `application.properties`
- `application-dev.properties` 
- `application-prod.properties`
- `firebase-service-account.json`
- `.env`

## Environment Variables

For production deployments, consider using environment variables instead of property files:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `FIREBASE_CONFIG_PATH`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

## Best Practices

1. **Never commit real credentials** to version control
2. Use different credentials for each environment (dev, staging, prod)
3. Rotate credentials regularly
4. Use strong, unique passwords and secrets
5. Consider using a secrets management service in production
6. Always use HTTPS in production
7. Keep Firebase service account files secure and with minimal permissions

## Test Credentials

Test environment uses safe, non-production credentials that are included in the repository for testing purposes only.