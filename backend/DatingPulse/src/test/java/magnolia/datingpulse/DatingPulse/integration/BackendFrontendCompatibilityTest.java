package magnolia.datingpulse.DatingPulse.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration test to verify backend-frontend compatibility.
 * This test ensures all fields expected by the frontend are available in the backend DTOs.
 */
class BackendFrontendCompatibilityTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testUserProfileDTOContainsAllFrontendFields() {
        // Create a UserProfileDTO with all fields that the frontend expects
        UserProfileDTO profile = new UserProfileDTO();
        
        // Basic information
        profile.setUserID(1L);
        profile.setFirstName("John");
        profile.setLastName("Doe");
        profile.setAge(25);
        profile.setGender("male");
        profile.setBio("Test bio");
        
        // Physical attributes
        profile.setHeight(180);
        profile.setWeight(75);
        profile.setBodyType("Athletic");
        profile.setEthnicity("Caucasian");
        
        // Lifestyle data
        profile.setPets("Dog lover");
        profile.setDrinking("Socially");
        profile.setSmoking("Never");
        profile.setWorkout("Often");
        profile.setDietaryPreference("Vegetarian");
        profile.setSocialMedia("Active");
        profile.setSleepingHabits("Early bird");
        profile.setLanguages(Set.of("English", "Spanish"));
        
        // Preferences
        profile.setRelationshipGoal("Long-term");
        profile.setSexualOrientation("Straight");
        profile.setLookingFor("Someone special");
        profile.setInterestedIn("female");
        
        // Personality
        profile.setCommunicationStyle("Direct");
        profile.setLoveLanguage("Quality Time");
        profile.setZodiacSign("Leo");
        
        // Media
        profile.setAudioIntroUrl("https://example.com/audio.mp3");
        
        // Visibility controls
        profile.setShowGender(true);
        profile.setShowAge(true);
        profile.setShowLocation(true);
        profile.setShowOrientation(false);
        
        // Extended fields
        profile.setReligion("Spiritual");
        profile.setPoliticalViews("Progressive");
        profile.setFamilyPlans("Want kids");
        profile.setFitnessLevel("High");
        profile.setTravelFrequency("Often");
        profile.setIndustry("Technology");
        
        // Preference arrays
        profile.setMusicPreferences(Set.of("Rock", "Jazz"));
        profile.setFoodPreferences(Set.of("Italian", "Mexican"));
        profile.setEntertainmentPreferences(Set.of("Movies", "Gaming"));
        
        // Additional text fields
        profile.setCurrentlyReading("The Great Gatsby");
        profile.setLifeGoals("Travel the world");
        profile.setPetPreferences("Dogs preferred");
        
        // Verify all fields are accessible (no exceptions thrown)
        assertAll(
            // Basic information
            () -> assertEquals(1L, profile.getUserID()),
            () -> assertEquals("John", profile.getFirstName()),
            () -> assertEquals("Doe", profile.getLastName()),
            () -> assertEquals(25, profile.getAge()),
            () -> assertEquals("male", profile.getGender()),
            () -> assertEquals("Test bio", profile.getBio()),
            
            // Physical attributes
            () -> assertEquals(180, profile.getHeight()),
            () -> assertEquals(75, profile.getWeight()),
            () -> assertEquals("Athletic", profile.getBodyType()),
            () -> assertEquals("Caucasian", profile.getEthnicity()),
            
            // Lifestyle data
            () -> assertEquals("Dog lover", profile.getPets()),
            () -> assertEquals("Socially", profile.getDrinking()),
            () -> assertEquals("Never", profile.getSmoking()),
            () -> assertEquals("Often", profile.getWorkout()),
            () -> assertEquals("Vegetarian", profile.getDietaryPreference()),
            () -> assertEquals("Active", profile.getSocialMedia()),
            () -> assertEquals("Early bird", profile.getSleepingHabits()),
            () -> assertTrue(profile.getLanguages().contains("English")),
            () -> assertTrue(profile.getLanguages().contains("Spanish")),
            
            // Preferences
            () -> assertEquals("Long-term", profile.getRelationshipGoal()),
            () -> assertEquals("Straight", profile.getSexualOrientation()),
            () -> assertEquals("Someone special", profile.getLookingFor()),
            () -> assertEquals("female", profile.getInterestedIn()),
            
            // Personality
            () -> assertEquals("Direct", profile.getCommunicationStyle()),
            () -> assertEquals("Quality Time", profile.getLoveLanguage()),
            () -> assertEquals("Leo", profile.getZodiacSign()),
            
            // Media
            () -> assertEquals("https://example.com/audio.mp3", profile.getAudioIntroUrl()),
            
            // Visibility controls
            () -> assertTrue(profile.getShowGender()),
            () -> assertTrue(profile.getShowAge()),
            () -> assertTrue(profile.getShowLocation()),
            () -> assertFalse(profile.getShowOrientation()),
            
            // Extended fields
            () -> assertEquals("Spiritual", profile.getReligion()),
            () -> assertEquals("Progressive", profile.getPoliticalViews()),
            () -> assertEquals("Want kids", profile.getFamilyPlans()),
            () -> assertEquals("High", profile.getFitnessLevel()),
            () -> assertEquals("Often", profile.getTravelFrequency()),
            () -> assertEquals("Technology", profile.getIndustry()),
            
            // Preference arrays
            () -> assertTrue(profile.getMusicPreferences().contains("Rock")),
            () -> assertTrue(profile.getFoodPreferences().contains("Italian")),
            () -> assertTrue(profile.getEntertainmentPreferences().contains("Movies")),
            
            // Additional text fields
            () -> assertEquals("The Great Gatsby", profile.getCurrentlyReading()),
            () -> assertEquals("Travel the world", profile.getLifeGoals()),
            () -> assertEquals("Dogs preferred", profile.getPetPreferences())
        );
        
        System.out.println("✅ All frontend-expected fields are available in backend DTO!");
    }
    
    @Test
    void testUserProfileDTOJsonSerialization() throws Exception {
        // Test that the DTO can be serialized to JSON (important for API responses)
        UserProfileDTO profile = new UserProfileDTO();
        profile.setUserID(1L);
        profile.setFirstName("Jane");
        profile.setLastName("Smith");
        profile.setAge(28);
        profile.setGender("female");
        profile.setHeight(165);
        profile.setBodyType("Petite");
        profile.setPets("Cat lover");
        profile.setRelationshipGoal("Casual dating");
        
        // Should serialize without errors
        String json = objectMapper.writeValueAsString(profile);
        assertNotNull(json);
        assertTrue(json.contains("firstName"));
        assertTrue(json.contains("lastName"));
        assertTrue(json.contains("height"));
        assertTrue(json.contains("bodyType"));
        assertTrue(json.contains("pets"));
        assertTrue(json.contains("relationshipGoal"));
        
        // Should deserialize back to object
        UserProfileDTO deserialized = objectMapper.readValue(json, UserProfileDTO.class);
        assertEquals(profile.getFirstName(), deserialized.getFirstName());
        assertEquals(profile.getLastName(), deserialized.getLastName());
        assertEquals(profile.getHeight(), deserialized.getHeight());
        assertEquals(profile.getBodyType(), deserialized.getBodyType());
        assertEquals(profile.getPets(), deserialized.getPets());
        assertEquals(profile.getRelationshipGoal(), deserialized.getRelationshipGoal());
        
        System.out.println("✅ UserProfileDTO JSON serialization/deserialization works correctly!");
    }
}