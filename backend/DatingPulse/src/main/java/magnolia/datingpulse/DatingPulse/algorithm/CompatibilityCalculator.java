package magnolia.datingpulse.DatingPulse.algorithm;

import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.entity.Preference;
import magnolia.datingpulse.DatingPulse.entity.Interest;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Calculator for user compatibility scores based on various factors
 */
@Component
public class CompatibilityCalculator {

    /**
     * Calculate overall compatibility score between two users (0.0 to 1.0)
     */
    public double calculateOverallCompatibility(UserProfile user1, UserProfile user2) {
        if (user1 == null || user2 == null) {
            return 0.0;
        }

        double locationScore = calculateLocationCompatibility(user1, user2);
        double ageScore = calculateAgeCompatibility(user1, user2);
        double interestScore = calculateInterestCompatibility(user1, user2);
        double preferenceScore = calculatePreferenceCompatibility(user1, user2);

        // Weighted average: location (30%), age (20%), interests (30%), preferences (20%)
        return (locationScore * 0.3) + (ageScore * 0.2) + (interestScore * 0.3) + (preferenceScore * 0.2);
    }

    /**
     * Calculate location-based compatibility (0.0 to 1.0)
     * Based on distance between users and their maximum distance preferences
     */
    public double calculateLocationCompatibility(UserProfile user1, UserProfile user2) {
        if (user1.getLatitude() == null || user1.getLongitude() == null ||
            user2.getLatitude() == null || user2.getLongitude() == null) {
            return 0.5; // Default score if location data is missing
        }

        double distance = calculateDistanceInKm(
            user1.getLatitude(), user1.getLongitude(),
            user2.getLatitude(), user2.getLongitude()
        );

        // Get maximum acceptable distance from preferences
        double maxDistance = getMaxAcceptableDistance(user1, user2);
        
        if (distance > maxDistance) {
            return 0.0; // Outside acceptable range
        }

        // Score decreases linearly with distance
        return Math.max(0.0, 1.0 - (distance / maxDistance));
    }

    /**
     * Calculate age-based compatibility (0.0 to 1.0)
     * Based on whether users fall within each other's age preferences
     */
    public double calculateAgeCompatibility(UserProfile user1, UserProfile user2) {
        if (user1.getAge() == null || user2.getAge() == null) {
            return 0.5; // Default score if age data is missing
        }

        boolean user1InUser2Range = isAgeInPreferenceRange(user1.getAge(), user2.getPreference());
        boolean user2InUser1Range = isAgeInPreferenceRange(user2.getAge(), user1.getPreference());

        if (user1InUser2Range && user2InUser1Range) {
            return 1.0; // Perfect match
        } else if (user1InUser2Range || user2InUser1Range) {
            return 0.5; // One-way match
        } else {
            return 0.0; // No match
        }
    }

    /**
     * Calculate interest-based compatibility (0.0 to 1.0)
     * Based on common interests between users
     */
    public double calculateInterestCompatibility(UserProfile user1, UserProfile user2) {
        Set<Interest> interests1 = user1.getInterests();
        Set<Interest> interests2 = user2.getInterests();

        if (interests1 == null || interests2 == null || 
            interests1.isEmpty() || interests2.isEmpty()) {
            return 0.5; // Default score if no interest data
        }

        // Count common interests
        long commonInterests = interests1.stream()
            .mapToLong(interest -> interests2.contains(interest) ? 1 : 0)
            .sum();

        // Calculate Jaccard similarity coefficient
        int totalUniqueInterests = interests1.size() + interests2.size() - (int)commonInterests;
        
        if (totalUniqueInterests == 0) {
            return 1.0;
        }

        return (double) commonInterests / totalUniqueInterests;
    }

    /**
     * Calculate preference-based compatibility (0.0 to 1.0)
     * Based on gender preferences and other preference factors
     */
    public double calculatePreferenceCompatibility(UserProfile user1, UserProfile user2) {
        if (user1.getPreference() == null || user2.getPreference() == null) {
            return 0.5; // Default score if no preference data
        }

        boolean user1AcceptsUser2Gender = isGenderCompatible(user2.getGender(), user1.getPreference());
        boolean user2AcceptsUser1Gender = isGenderCompatible(user1.getGender(), user2.getPreference());

        if (user1AcceptsUser2Gender && user2AcceptsUser1Gender) {
            return 1.0; // Mutual gender preference match
        } else if (user1AcceptsUser2Gender || user2AcceptsUser1Gender) {
            return 0.3; // One-way gender preference match
        } else {
            return 0.0; // No gender preference match
        }
    }

    /**
     * Calculate distance between two points using Haversine formula
     */
    public double calculateDistanceInKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    /**
     * Check if an age falls within the preference range
     */
    public boolean isAgeInPreferenceRange(Integer age, Preference preference) {
        if (age == null || preference == null) {
            return false;
        }

        Integer minAge = preference.getAgeMin();
        Integer maxAge = preference.getAgeMax();

        if (minAge == null && maxAge == null) {
            return true; // No age restrictions
        }

        if (minAge != null && age < minAge) {
            return false;
        }

        if (maxAge != null && age > maxAge) {
            return false;
        }

        return true;
    }

    /**
     * Check if a gender is compatible with user preferences
     */
    public boolean isGenderCompatible(String targetGender, Preference preference) {
        if (targetGender == null || preference == null) {
            return false;
        }

        String genderPreference = preference.getGenderPreference();
        if (genderPreference == null || genderPreference.equalsIgnoreCase("ANY")) {
            return true; // No gender restrictions
        }

        return targetGender.equalsIgnoreCase(genderPreference);
    }

    /**
     * Get the maximum acceptable distance between two users
     */
    private double getMaxAcceptableDistance(UserProfile user1, UserProfile user2) {
        double maxDistance1 = getMaxDistanceFromPreference(user1.getPreference());
        double maxDistance2 = getMaxDistanceFromPreference(user2.getPreference());
        
        // Use the smaller of the two maximum distances (more restrictive)
        return Math.min(maxDistance1, maxDistance2);
    }

    /**
     * Extract maximum distance from user preference
     */
    private double getMaxDistanceFromPreference(Preference preference) {
        if (preference == null || preference.getMaxDistance() == null) {
            return 50.0; // Default 50km if no preference set
        }
        return preference.getMaxDistance().doubleValue();
    }
}
