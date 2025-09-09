-- Fix admin permissions schema to match JPA entity expectations
-- V5__Fix_admin_permissions_schema.sql

-- Create the admin_permissions join table that the JPA @ManyToMany relationship expects
CREATE TABLE admin_permissions (
    admin_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (admin_id, permission_id),
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

-- Migrate existing admin permission data from TEXT[] to the join table
-- First, we need to handle the existing admin record that uses permission names
INSERT INTO admin_permissions (admin_id, permission_id)
SELECT 
    a.admin_id,
    p.permission_id
FROM admins a
CROSS JOIN permissions p
WHERE p.name = ANY(a.permissions)
  AND a.permissions IS NOT NULL;

-- Add role column to admins table to match the entity
ALTER TABLE admins ADD COLUMN role VARCHAR(20) DEFAULT 'ADMIN' NOT NULL;

-- Set the admin role for existing records
UPDATE admins SET role = 'SUPER_ADMIN' WHERE admin_id = 1;

-- Drop the old permissions column now that data is migrated
ALTER TABLE admins DROP COLUMN permissions;

-- Drop the created_at and is_active columns from admins table as they're not in the entity
ALTER TABLE admins DROP COLUMN created_at;
ALTER TABLE admins DROP COLUMN is_active;

-- Update the permission table to match entity expectations
-- Rename permission_id to id to match the entity
ALTER TABLE permissions RENAME COLUMN permission_id TO id;

-- Update foreign key references in admin_permissions table
ALTER TABLE admin_permissions DROP CONSTRAINT admin_permissions_permission_id_fkey;
ALTER TABLE admin_permissions ADD CONSTRAINT admin_permissions_permission_id_fkey 
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE;

-- Add index for better performance on the join table
CREATE INDEX idx_admin_permissions_admin_id ON admin_permissions(admin_id);
CREATE INDEX idx_admin_permissions_permission_id ON admin_permissions(permission_id);

-- Add missing columns to conversations table to match entity expectations
ALTER TABLE conversations 
ADD COLUMN deleted_for_user1 BOOLEAN DEFAULT FALSE,
ADD COLUMN deleted_for_user2 BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON TABLE admin_permissions IS 'Join table for many-to-many relationship between admins and permissions';
COMMENT ON COLUMN admins.role IS 'Admin role: ADMIN or SUPER_ADMIN';