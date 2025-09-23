package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.dto.ProfileResponseDTO;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for profile validation functionality
 */
class ProfileValidationTest {

    @Test
    void testProfileResponseDTOStructure() {
        // Test that ProfileResponseDTO can be created with all required fields
        UserProfileDTO profile = new UserProfileDTO();
        profile.setUserID(1L);
        profile.setFirstName("Test");
        profile.setLastName("User");

        ProfileResponseDTO response = ProfileResponseDTO.builder()
                .profile(profile)
                .isVerified(true)
                .completionPercentage(85.0)
                .verifiedTypes(java.util.Arrays.asList("PHOTO", "ID"))
                .missingFields(java.util.Arrays.asList("bio"))
                .build();

        assertNotNull(response);
        assertEquals(true, response.getIsVerified());
        assertEquals(85.0, response.getCompletionPercentage());
        assertEquals(2, response.getVerifiedTypes().size());
        assertEquals(1, response.getMissingFields().size());
        assertTrue(response.getVerifiedTypes().contains("PHOTO"));
        assertTrue(response.getVerifiedTypes().contains("ID"));
        assertTrue(response.getMissingFields().contains("bio"));
    }

    @Test
    void testCompleteProfileStructure() {
        // Create a sample complete profile
        UserProfileDTO profile = new UserProfileDTO();
        profile.setUserID(1L);
        profile.setFirstName("John");
        profile.setLastName("Doe");
        profile.setAge(25);
        profile.setGender("MALE");
        profile.setDob(LocalDate.of(1998, 1, 1));
        profile.setBio("Test bio");
        profile.setPp("test-photo.jpg");
        profile.setEducation("University");
        profile.setJobTitle("Developer");
        profile.setCity("Test City");

        // Verify all fields are populated (would be 100% complete)
        assertNotNull(profile.getFirstName());
        assertNotNull(profile.getLastName());
        assertNotNull(profile.getAge());
        assertNotNull(profile.getGender());
        assertNotNull(profile.getDob());
        assertNotNull(profile.getBio());
        assertNotNull(profile.getPp());
        assertNotNull(profile.getEducation());
        assertNotNull(profile.getJobTitle());
        assertNotNull(profile.getCity());
    }

    @Test
    void testIncompleteProfileStructure() {
        // Create a sample incomplete profile
        UserProfileDTO profile = new UserProfileDTO();
        profile.setUserID(1L);
        profile.setFirstName("Jane");
        profile.setLastName("Smith");
        profile.setAge(30);
        profile.setGender("FEMALE");
        profile.setDob(LocalDate.of(1993, 5, 15));
        // Missing: bio, pp, education, jobTitle, city

        // Verify required fields are populated
        assertNotNull(profile.getFirstName());
        assertNotNull(profile.getLastName());
        assertNotNull(profile.getAge());
        assertNotNull(profile.getGender());
        assertNotNull(profile.getDob());
        
        // Verify optional fields are missing (would be ~50% complete)
        assertNull(profile.getBio());
        assertNull(profile.getPp());
        assertNull(profile.getEducation());
        assertNull(profile.getJobTitle());
        assertNull(profile.getCity());
    }
}