-- Add missing device_info column and fix device_type constraint
-- V6__Add_device_info_column.sql

-- Add the device_info column that the Device entity expects
ALTER TABLE devices 
ADD COLUMN device_info VARCHAR(500);

-- Update device_type constraint to include DESKTOP type that the entity expects
ALTER TABLE devices DROP CONSTRAINT devices_device_type_check;
ALTER TABLE devices ADD CONSTRAINT devices_device_type_check 
    CHECK (device_type IN ('ANDROID', 'IOS', 'WEB', 'DESKTOP'));

-- Add comment for documentation
COMMENT ON COLUMN devices.device_info IS 'Device information like user agent, browser version, etc.';