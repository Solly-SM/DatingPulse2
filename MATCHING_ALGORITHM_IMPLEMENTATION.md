# Matching Algorithm Implementation

This document describes the implemented matching algorithm for the DatingPulse application.

## Overview

The matching algorithm is designed to find compatible users based on multiple factors including location, age, interests, and user preferences. It provides a comprehensive scoring system that ranks potential matches from 0.0 (incompatible) to 1.0 (perfect match).

## Architecture

### Core Components

1. **CompatibilityCalculator** (`algorithm/CompatibilityCalculator.java`)
   - Core algorithm implementation
   - Handles distance calculations, age compatibility, interest matching, and preference matching
   - Provides weighted overall compatibility scoring

2. **MatchingService** (`service/MatchingService.java`)
   - Business logic for finding potential matches
   - Filters users based on various criteria
   - Integrates with existing user management systems

3. **MatchingController** (`controller/MatchingController.java`)
   - REST API endpoints for matching functionality
   - Handles HTTP requests and responses

## Compatibility Scoring Algorithm

### Overall Compatibility Score
The overall compatibility is calculated using a weighted average of four components:

```
Overall Score = (Location × 0.3) + (Age × 0.2) + (Interests × 0.3) + (Preferences × 0.2)
```

### Location Compatibility (30% weight)
- Uses the Haversine formula to calculate distance between users
- Considers both users' maximum distance preferences
- Score decreases linearly with distance up to the maximum acceptable distance
- Returns 0.0 if users are outside each other's acceptable range

**Formula:**
```
Location Score = max(0.0, 1.0 - (distance / max_acceptable_distance))
```

### Age Compatibility (20% weight)
- Checks if each user falls within the other's age preference range
- Returns 1.0 for mutual compatibility, 0.5 for one-way compatibility, 0.0 for no compatibility

### Interest Compatibility (30% weight)
- Uses Jaccard similarity coefficient to measure common interests
- Formula: `common_interests / (total_unique_interests)`
- Returns 0.5 if either user has no interests defined

### Preference Compatibility (20% weight)
- Primarily focuses on gender preference matching
- Returns 1.0 for mutual gender preference match
- Returns 0.3 for one-way gender preference match
- Returns 0.0 for no gender preference match

## API Endpoints

### Find Potential Matches
```
GET /api/v1/matching/users/{userId}/potential-matches?limit=20
```
Returns a list of potential matches ranked by compatibility score.

### Find Nearby Matches
```
GET /api/v1/matching/users/{userId}/nearby-matches?radiusKm=50&limit=20
```
Returns matches within a specified distance radius.

### Find Matches by Age
```
GET /api/v1/matching/users/{userId}/age-matches?minAge=25&maxAge=35&limit=20
```
Returns matches within a specified age range.

### Get Compatibility Score
```
GET /api/v1/matching/compatibility/{userId1}/{userId2}
```
Returns the compatibility score between two specific users.

## Filtering Logic

The matching service applies several filters before calculating compatibility:

1. **Basic Filters:**
   - Excludes the requesting user
   - Only includes active users
   - Excludes users who have been swiped on before
   - Excludes blocked users

2. **Compatibility Filters:**
   - Gender preference compatibility
   - Age range compatibility  
   - Location distance compatibility
   - Minimum compatibility threshold (0.1)

## Usage Examples

### Finding Matches for a User
```java
@Autowired
private MatchingService matchingService;

// Find top 10 potential matches for user with ID 123
List<UserProfileDTO> matches = matchingService.findPotentialMatches(123L, 10);

// Find matches within 25km radius
List<UserProfileDTO> nearbyMatches = matchingService.findPotentialMatchesNearby(123L, 25.0, 10);

// Get compatibility score between two users
double score = matchingService.getCompatibilityScore(123L, 456L);
```

### Using the Compatibility Calculator Directly
```java
@Autowired
private CompatibilityCalculator calculator;

// Calculate overall compatibility
double overallScore = calculator.calculateOverallCompatibility(userProfile1, userProfile2);

// Calculate specific compatibility aspects
double locationScore = calculator.calculateLocationCompatibility(userProfile1, userProfile2);
double ageScore = calculator.calculateAgeCompatibility(userProfile1, userProfile2);
double interestScore = calculator.calculateInterestCompatibility(userProfile1, userProfile2);
```

## Data Requirements

For the matching algorithm to work effectively, users need:

1. **Required for Location Matching:**
   - Latitude and longitude coordinates
   - Maximum distance preference

2. **Required for Age Matching:**
   - User age
   - Minimum and maximum age preferences

3. **Required for Interest Matching:**
   - Set of user interests

4. **Required for Preference Matching:**
   - Gender preference setting

## Performance Considerations

- The current implementation loads all user profiles for filtering, which may not scale for large user bases
- For production use, consider implementing database-level filtering with spatial queries
- Caching compatibility scores for frequently accessed user pairs could improve performance
- Consider implementing pagination for large result sets

## Future Enhancements

1. **Machine Learning Integration:**
   - User behavior analysis
   - Success rate tracking
   - Adaptive scoring weights

2. **Advanced Filtering:**
   - Education level compatibility
   - Lifestyle preferences
   - Activity patterns

3. **Performance Optimizations:**
   - Database spatial queries
   - Caching layer
   - Asynchronous processing

## Testing

The implementation includes comprehensive unit tests for:
- Distance calculations (Haversine formula accuracy)
- Age compatibility logic
- Interest similarity calculations
- Overall compatibility scoring
- Service-level matching logic

Run tests with:
```bash
mvn test -Dtest=CompatibilityCalculatorTest
mvn test -Dtest=MatchingServiceTest
```