# DatingPulse API Documentation Guide

## Overview
Your DatingPulse backend now includes comprehensive API documentation using OpenAPI/Swagger. This provides an interactive interface for exploring and testing your API endpoints.

## Quick Start

### Running the Application
To start the application with the new API documentation:

```bash
cd backend/DatingPulse
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Accessing the Documentation

Once the application is running, you can access:

1. **Swagger UI (Interactive Documentation)**: http://localhost:8080/swagger-ui.html
   - Browse all API endpoints
   - Test endpoints directly from the browser
   - View request/response schemas
   - See parameter validation rules

2. **OpenAPI JSON**: http://localhost:8080/api-docs
   - Raw OpenAPI specification in JSON format
   - Can be imported into tools like Postman or Insomnia

3. **H2 Database Console**: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:datingpulse`
   - Username: `sa`
   - Password: (leave blank)

## What's Been Added

### 1. OpenAPI Dependencies
- Added `springdoc-openapi-starter-webmvc-ui` for automatic API documentation generation

### 2. API Documentation
- **UserController**: Fully documented with operation descriptions, parameter examples, and response schemas
- **InterestController**: Complete documentation for interest management endpoints
- **Enhanced DTOs**: UserDTO and InterestDTO now include schema annotations with examples

### 3. Development Environment
- **H2 In-Memory Database**: No need for external PostgreSQL during development
- **Development Profile**: Use `-Dspring-boot.run.profiles=dev` for development mode
- **Enhanced Logging**: Better debugging information in development mode

## API Documentation Features

### Interactive Testing
- Click on any endpoint in Swagger UI
- Click "Try it out"
- Fill in parameters
- Click "Execute" to test the endpoint

### Schema Documentation
- View detailed request/response schemas
- See validation constraints and requirements
- Example values for all fields

### Grouped Endpoints
- **User Management**: All user-related operations
- **Interest Management**: Interest and hobby management
- More groups will be added as documentation expands

## Next Steps for Development

### To Add Documentation to More Controllers:
1. Add OpenAPI imports to the controller
2. Add `@Tag` annotation to the controller class
3. Add `@Operation` and `@ApiResponses` to methods
4. Add `@Parameter` annotations to method parameters

### Example:
```java
@Tag(name = "Your Feature", description = "Description of your feature")
@Operation(summary = "Short description", description = "Detailed description")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Success",
                content = @Content(schema = @Schema(implementation = YourDTO.class)))
})
```

## Benefits

1. **Developer Experience**: Easy to understand and test API endpoints
2. **Frontend Integration**: Clear contract for frontend developers
3. **API Testing**: Built-in testing interface
4. **Documentation**: Always up-to-date API documentation
5. **Validation**: Clear validation rules and constraints

## Production Considerations

- The development profile uses H2 in-memory database
- For production, use the default profile with PostgreSQL
- Consider adding security documentation when authentication is implemented
- Add rate limiting documentation for production APIs

Enjoy exploring your API with the new interactive documentation! 🚀