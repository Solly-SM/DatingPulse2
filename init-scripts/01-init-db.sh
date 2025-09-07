#!/bin/bash
set -e

# Create database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Database should already be created by the POSTGRES_DB environment variable
    -- This script can be used for additional initialization if needed
    
    SELECT 'Database datingpulse is ready for use!';
EOSQL