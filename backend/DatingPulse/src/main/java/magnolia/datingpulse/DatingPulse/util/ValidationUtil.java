package magnolia.datingpulse.DatingPulse.util;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Comprehensive validation utility for the DatingPulse application.
 * Provides centralized validation services for entities and DTOs.
 */
@Component
@Slf4j
public class ValidationUtil {

    private final Validator validator;

    public ValidationUtil() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    /**
     * Validates an object and returns constraint violations
     *
     * @param object The object to validate
     * @param <T> The type of the object
     * @return Set of constraint violations, empty if valid
     */
    public <T> Set<ConstraintViolation<T>> validate(T object) {
        if (object == null) {
            log.warn("Attempting to validate null object");
            return Set.of();
        }

        Set<ConstraintViolation<T>> violations = validator.validate(object);
        
        if (!violations.isEmpty()) {
            log.debug("Validation violations found for {}: {}", 
                object.getClass().getSimpleName(), 
                formatViolations(violations));
        }

        return violations;
    }

    /**
     * Validates an object and throws an exception if invalid
     *
     * @param object The object to validate
     * @param <T> The type of the object
     * @throws IllegalArgumentException if validation fails
     */
    public <T> void validateAndThrow(T object) {
        Set<ConstraintViolation<T>> violations = validate(object);
        if (!violations.isEmpty()) {
            String errorMessage = formatViolations(violations);
            log.error("Validation failed for {}: {}", 
                object.getClass().getSimpleName(), errorMessage);
            throw new IllegalArgumentException("Validation failed: " + errorMessage);
        }
    }

    /**
     * Checks if an object is valid
     *
     * @param object The object to validate
     * @param <T> The type of the object
     * @return true if valid, false otherwise
     */
    public <T> boolean isValid(T object) {
        return validate(object).isEmpty();
    }

    /**
     * Validates an object and returns a formatted error message
     *
     * @param object The object to validate
     * @param <T> The type of the object
     * @return Formatted error message, null if valid
     */
    public <T> String getValidationErrors(T object) {
        Set<ConstraintViolation<T>> violations = validate(object);
        return violations.isEmpty() ? null : formatViolations(violations);
    }

    /**
     * Validates specific property of an object
     *
     * @param object The object to validate
     * @param propertyName The property name to validate
     * @param <T> The type of the object
     * @return Set of constraint violations for the property
     */
    public <T> Set<ConstraintViolation<T>> validateProperty(T object, String propertyName) {
        if (object == null || propertyName == null) {
            return Set.of();
        }

        return validator.validateProperty(object, propertyName);
    }

    /**
     * Validates a property value against an object type
     *
     * @param beanType The class of the object
     * @param propertyName The property name
     * @param value The value to validate
     * @param <T> The type of the object
     * @return Set of constraint violations
     */
    public <T> Set<ConstraintViolation<T>> validateValue(Class<T> beanType, String propertyName, Object value) {
        return validator.validateValue(beanType, propertyName, value);
    }

    /**
     * Formats validation violations into a readable string
     *
     * @param violations The set of violations
     * @param <T> The type of the object
     * @return Formatted string of violations
     */
    public <T> String formatViolations(Set<ConstraintViolation<T>> violations) {
        if (violations.isEmpty()) {
            return "";
        }

        return violations.stream()
                .map(violation -> String.format("%s: %s", 
                    violation.getPropertyPath(), 
                    violation.getMessage()))
                .collect(Collectors.joining("; "));
    }

    /**
     * Gets the number of validation errors for an object
     *
     * @param object The object to validate
     * @param <T> The type of the object
     * @return Number of validation errors
     */
    public <T> int getViolationCount(T object) {
        return validate(object).size();
    }

    /**
     * Validates multiple objects and returns combined violations
     *
     * @param objects The objects to validate
     * @return Combined validation summary
     */
    public ValidationSummary validateMultiple(Object... objects) {
        ValidationSummary summary = new ValidationSummary();
        
        for (Object object : objects) {
            if (object != null) {
                Set<ConstraintViolation<Object>> violations = validate(object);
                summary.addViolations(object.getClass().getSimpleName(), violations);
            }
        }
        
        return summary;
    }

    /**
     * Summary of validation results for multiple objects
     */
    public static class ValidationSummary {
        private final StringBuilder summary = new StringBuilder();
        private int totalViolations = 0;
        private int validatedObjects = 0;

        public void addViolations(String objectType, Set<ConstraintViolation<Object>> violations) {
            validatedObjects++;
            totalViolations += violations.size();

            if (!violations.isEmpty()) {
                summary.append(String.format("%s: %s%n", objectType, 
                    violations.stream()
                        .map(v -> String.format("%s: %s", v.getPropertyPath(), v.getMessage()))
                        .collect(Collectors.joining("; "))));
            }
        }

        public boolean isValid() {
            return totalViolations == 0;
        }

        public int getTotalViolations() {
            return totalViolations;
        }

        public int getValidatedObjects() {
            return validatedObjects;
        }

        public String getSummary() {
            if (isValid()) {
                return String.format("All %d objects are valid", validatedObjects);
            }
            return String.format("Validation failed for %d violations across %d objects:%n%s", 
                totalViolations, validatedObjects, summary.toString());
        }

        @Override
        public String toString() {
            return getSummary();
        }
    }

    /**
     * Validates an object and logs the results
     *
     * @param object The object to validate
     * @param context Additional context for logging
     * @param <T> The type of the object
     * @return true if valid, false otherwise
     */
    public <T> boolean validateAndLog(T object, String context) {
        Set<ConstraintViolation<T>> violations = validate(object);
        
        if (violations.isEmpty()) {
            log.debug("Validation passed for {} in context: {}", 
                object.getClass().getSimpleName(), context);
            return true;
        } else {
            log.warn("Validation failed for {} in context {}: {}", 
                object.getClass().getSimpleName(), context, formatViolations(violations));
            return false;
        }
    }

    /**
     * Quick validation check for common DTO patterns
     *
     * @param object The object to validate
     * @param <T> The type of the object
     * @return ValidationResult with status and message
     */
    public <T> ValidationResult quickValidate(T object) {
        Set<ConstraintViolation<T>> violations = validate(object);
        
        return new ValidationResult(
            violations.isEmpty(),
            violations.isEmpty() ? "Valid" : formatViolations(violations),
            violations.size()
        );
    }

    /**
     * Result of a validation operation
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final int violationCount;

        public ValidationResult(boolean valid, String message, int violationCount) {
            this.valid = valid;
            this.message = message;
            this.violationCount = violationCount;
        }

        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public int getViolationCount() { return violationCount; }

        @Override
        public String toString() {
            return String.format("ValidationResult{valid=%s, violations=%d, message='%s'}", 
                valid, violationCount, message);
        }
    }
}