# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the Role-Based Access Control (RBAC) implementation added to the DatingPulse application.

## Role Hierarchy
The application now supports a three-tier role hierarchy:

```
SUPER_ADMIN > ADMIN > USER
```

- **USER**: Regular application users
- **ADMIN**: Administrators with read access to admin features and some write permissions
- **SUPER_ADMIN**: Super administrators with full control over all admin features

## Implementation Details

### 1. Method Security
- Added `@EnableMethodSecurity(prePostEnabled = true)` to SecurityConfig
- Enables `@PreAuthorize` annotations throughout the application

### 2. Role Hierarchy Configuration
- Configured Spring Security role hierarchy: `ROLE_SUPER_ADMIN > ROLE_ADMIN > ROLE_USER`
- Higher roles automatically inherit permissions from lower roles

### 3. Entity Updates
- **User Entity**: Updated role validation pattern to support `USER`, `ADMIN`, `SUPER_ADMIN`
- **AdminDTO**: Updated role validation to support `ADMIN`, `SUPER_ADMIN` (admins cannot be regular users)
- **Admin Entity**: Updated role comments to reflect new hierarchy

### 4. AdminController Security
All AdminController endpoints now have appropriate `@PreAuthorize` annotations:

| Endpoint | Access Level | Description |
|----------|-------------|-------------|
| `POST /api/admins` | SUPER_ADMIN | Create new admin |
| `GET /api/admins/{adminId}` | ADMIN | Get admin by ID |
| `GET /api/admins/user/{userId}` | ADMIN | Get admin by user ID |
| `GET /api/admins/role/{role}` | ADMIN | Get admins by role |
| `GET /api/admins` | ADMIN | Get all admins |
| `PUT /api/admins/{adminId}` | SUPER_ADMIN | Update admin |
| `POST /api/admins/{adminId}/permissions/{permissionId}` | SUPER_ADMIN | Add permission to admin |
| `DELETE /api/admins/{adminId}/permissions/{permissionId}` | SUPER_ADMIN | Remove permission from admin |
| `DELETE /api/admins/{adminId}` | SUPER_ADMIN | Delete admin |
| `GET /api/admins/{adminId}/permissions/{permissionName}` | ADMIN | Check if admin has permission |
| `GET /api/admins/check-user/{userId}` | ADMIN | Check if user is admin |

### 5. PermissionController Security
All PermissionController endpoints now have appropriate `@PreAuthorize` annotations:

| Endpoint | Access Level | Description |
|----------|-------------|-------------|
| `POST /api/permissions` | SUPER_ADMIN | Create permission |
| `GET /api/permissions/{id}` | ADMIN | Get permission by ID |
| `GET /api/permissions/name/{name}` | ADMIN | Get permission by name |
| `GET /api/permissions` | ADMIN | Get all permissions |
| `GET /api/permissions/search` | ADMIN | Search permissions |
| `PUT /api/permissions/{id}` | SUPER_ADMIN | Update permission |
| `DELETE /api/permissions/{id}` | SUPER_ADMIN | Delete permission |
| `GET /api/permissions/exists/{name}` | ADMIN | Check if permission exists |
| `GET /api/permissions/count` | ADMIN | Get permission count |
| `POST /api/permissions/initialize-defaults` | SUPER_ADMIN | Initialize default permissions |

## Testing
- Added `RoleBasedAccessControlTest` to verify role hierarchy and method security configuration
- All existing tests continue to pass, ensuring no regression

## Security Design Principles
1. **Principle of Least Privilege**: Users are granted minimum necessary permissions
2. **Hierarchical Access**: Higher roles inherit permissions from lower roles
3. **Administrative Separation**: Regular users cannot perform admin functions
4. **Super Admin Control**: Only SUPER_ADMIN can create/modify/delete admins and permissions

## Migration Notes
- Existing users with role "ADMIN" or "USER" will continue to work unchanged
- New "SUPER_ADMIN" role can be assigned to users who need full administrative control
- All admin endpoints now require authentication and appropriate role