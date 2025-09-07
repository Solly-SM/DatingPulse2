# Testing Foundation Documentation

## Overview
This document describes the comprehensive testing infrastructure implemented for the DatingPulse application.

## Test Structure

### 1. Unit Tests
**Location**: `src/test/java/magnolia/datingpulse/DatingPulse/service/`

#### UserServiceTest
- **Purpose**: Tests business logic in the UserService layer
- **Test Count**: 13 tests
- **Coverage**: User creation, retrieval, updates, management operations
- **Mocking**: Uses Mockito to mock repository and dependencies
- **Execution Time**: Fast (~2 seconds)

**Example test categories**:
- User Creation Tests (validation, duplicate handling)
- User Retrieval Tests (by ID, username, email)
- User Update Tests (profile updates, password changes)
- User Management Tests (suspend, ban, delete operations)

### 2. Integration Tests
**Location**: `src/test/java/magnolia/datingpulse/DatingPulse/controller/`

#### UserControllerTest
- **Purpose**: Tests complete HTTP request/response cycles for UserController
- **Database**: H2 in-memory database for fast execution
- **Features**: Full Spring context, real HTTP calls, database transactions

#### AuthControllerTest
- **Purpose**: Tests authentication flows including registration, login, logout
- **Test Count**: 14 tests
- **Coverage**: Registration validation, login authentication, logout handling
- **Database**: H2 in-memory database

**Example test categories**:
- User Registration Tests (valid/invalid data, duplicate prevention)
- User Login Tests (credential validation, token generation)
- User Logout Tests (token invalidation)
- Authentication Flow Tests (end-to-end scenarios)

### 3. Test Infrastructure

#### BaseIntegrationTest
- **Purpose**: Base class for fast integration tests using H2
- **Database**: H2 in-memory database
- **Configuration**: Uses `application-test.properties`
- **Speed**: Fast startup and execution

#### BasePostgreSQLIntegrationTest
- **Purpose**: Base class for production-like testing with PostgreSQL
- **Database**: PostgreSQL via TestContainers
- **Use Case**: When PostgreSQL-specific behavior needs testing
- **Speed**: Slower but more accurate

#### TestDataBuilder
- **Purpose**: Utility class for creating test data objects
- **Features**: Pre-configured valid/invalid test objects
- **Usage**: Reduces test code duplication and ensures consistency

## Test Configuration

### application-test.properties
```properties
# H2 in-memory database for fast testing
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA configuration for tests
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Disable Flyway for tests
spring.flyway.enabled=false
```

### Dependencies Added
```xml
<!-- TestContainers for integration tests -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-testcontainers</artifactId>
    <scope>test</scope>
</dependency>
```

## Running Tests

### All Tests
```bash
mvn test
```

### Specific Test Classes
```bash
# Run only UserService unit tests
mvn test -Dtest=UserServiceTest

# Run only AuthController integration tests
mvn test -Dtest=AuthControllerTest

# Run only UserController integration tests
mvn test -Dtest=UserControllerTest
```

### Test Categories
```bash
# Run only unit tests (fast)
mvn test -Dtest="*ServiceTest"

# Run only integration tests
mvn test -Dtest="*ControllerTest"
```

## Current Test Status

### Summary
- **Total Tests**: 70
- **Passing**: 58 (83% success rate)
- **Failing**: 12 (mostly integration tests needing fine-tuning)

### Test Coverage by Component
1. **UserService**: 13/13 tests passing (100%)
2. **AuthController**: 11/14 tests passing (79%)
3. **UserController**: Various endpoints tested
4. **Existing Tests**: All original tests still passing

## Best Practices Implemented

### 1. Test Organization
- Clear nested test classes using `@Nested`
- Descriptive test names using `@DisplayName`
- Logical grouping of related test scenarios

### 2. Test Data Management
- Centralized test data creation via `TestDataBuilder`
- Database cleanup between tests using `@Transactional`
- Isolated test scenarios to prevent interference

### 3. Assertion Strategies
- Comprehensive response validation (status codes, content, headers)
- JSON path assertions for API responses
- Exception testing for error scenarios

### 4. Performance Considerations
- H2 for fast unit and integration tests
- TestContainers for production-like testing when needed
- Efficient test data setup and cleanup

## Future Enhancements

### Planned Improvements
1. **Enhanced Coverage**: Add more controller tests for remaining endpoints
2. **Performance Testing**: Add load testing capabilities
3. **Security Testing**: Add specific security validation tests
4. **Documentation Testing**: API documentation validation
5. **Error Scenario Testing**: More comprehensive error handling tests

### Advanced Features Available
1. **TestContainers Integration**: Ready for PostgreSQL testing
2. **Test Profiles**: Different configurations for different test types
3. **Mock Strategy**: Flexible mocking for different test scenarios
4. **CI/CD Ready**: Tests configured for continuous integration

## Troubleshooting

### Common Issues
1. **Test Failures**: Check application logs for detailed error messages
2. **Database Issues**: Ensure H2 configuration is correct in test properties
3. **Port Conflicts**: Use random ports for web tests
4. **TestContainers**: Ensure Docker is running if using PostgreSQL tests

### Debug Mode
```bash
# Run tests with debug output
mvn test -X

# Run specific failing test with verbose output
mvn test -Dtest=AuthControllerTest#shouldRegisterUserSuccessfully -X
```

This testing foundation provides a solid base for ensuring code quality and reliability as the DatingPulse application grows.