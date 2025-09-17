package magnolia.datingpulse.DatingPulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import magnolia.datingpulse.DatingPulse.dto.ProfileResponseDTO;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import magnolia.datingpulse.DatingPulse.service.UserProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfileController.class)
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileService userProfileService;

    @Autowired
    private ObjectMapper objectMapper;

    private ProfileResponseDTO sampleProfileResponse;
    private UserProfileDTO sampleUserProfile;

    @BeforeEach
    void setUp() {
        sampleUserProfile = new UserProfileDTO();
        sampleUserProfile.setUserID(1L);
        sampleUserProfile.setFirstname("John");
        sampleUserProfile.setLastname("Doe");
        sampleUserProfile.setAge(25);
        sampleUserProfile.setGender("MALE");
        sampleUserProfile.setDob(LocalDate.of(1999, 1, 1));

        sampleProfileResponse = ProfileResponseDTO.builder()
                .profile(sampleUserProfile)
                .isVerified(true)
                .completionPercentage(85.0)
                .verifiedTypes(Arrays.asList("PHOTO", "ID"))
                .missingFields(Arrays.asList("bio"))
                .build();
    }

    @Test
    void testGetProfile_Success() throws Exception {
        // Setup
        when(userProfileService.getProfileWithStatus(1L)).thenReturn(sampleProfileResponse);

        // Execute & Verify
        mockMvc.perform(get("/api/profile/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profile.userID").value(1))
                .andExpect(jsonPath("$.profile.firstname").value("John"))
                .andExpect(jsonPath("$.profile.lastname").value("Doe"))
                .andExpect(jsonPath("$.isVerified").value(true))
                .andExpect(jsonPath("$.completionPercentage").value(85.0))
                .andExpect(jsonPath("$.verifiedTypes[0]").value("PHOTO"))
                .andExpect(jsonPath("$.verifiedTypes[1]").value("ID"))
                .andExpect(jsonPath("$.missingFields[0]").value("bio"));
    }

    @Test
    void testGetProfile_UserNotFound() throws Exception {
        // Setup
        when(userProfileService.getProfileWithStatus(999L))
                .thenThrow(new IllegalArgumentException("User not found with ID: 999"));

        // Execute & Verify
        mockMvc.perform(get("/api/profile/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetProfile_InvalidUserId() throws Exception {
        // Execute & Verify - negative user ID should trigger validation error
        mockMvc.perform(get("/api/profile/-1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetProfile_ZeroUserId() throws Exception {
        // Execute & Verify - zero user ID should trigger validation error
        mockMvc.perform(get("/api/profile/0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateProfile_Success() throws Exception {
        // Setup
        UserProfileDTO updateRequest = new UserProfileDTO();
        updateRequest.setUserID(1L);
        updateRequest.setFirstname("John");
        updateRequest.setLastname("Doe");
        updateRequest.setAge(26); // Updated age
        updateRequest.setGender("MALE");
        updateRequest.setDob(LocalDate.of(1998, 1, 1)); // Updated DOB

        ProfileResponseDTO updatedResponse = ProfileResponseDTO.builder()
                .profile(updateRequest)
                .isVerified(true)
                .completionPercentage(90.0) // Improved completion
                .verifiedTypes(Arrays.asList("PHOTO", "ID"))
                .missingFields(Collections.emptyList()) // No missing fields
                .build();

        when(userProfileService.updateUserProfile(eq(1L), any(UserProfileDTO.class)))
                .thenReturn(updateRequest);
        when(userProfileService.getProfileWithStatus(1L)).thenReturn(updatedResponse);

        // Execute & Verify
        mockMvc.perform(put("/api/profile/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profile.age").value(26))
                .andExpect(jsonPath("$.completionPercentage").value(90.0))
                .andExpect(jsonPath("$.missingFields").isEmpty());
    }

    @Test
    void testUpdateProfile_InvalidData() throws Exception {
        // Setup - invalid profile data
        UserProfileDTO invalidRequest = new UserProfileDTO();
        invalidRequest.setUserID(1L);
        invalidRequest.setAge(-5); // Invalid age
        invalidRequest.setGender("INVALID_GENDER"); // Invalid gender

        // Execute & Verify
        mockMvc.perform(put("/api/profile/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateProfileCompletion_Success() throws Exception {
        // Execute & Verify
        mockMvc.perform(post("/api/profile/1/update-completion"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateProfileCompletion_UserNotFound() throws Exception {
        // Setup
        doThrow(new IllegalArgumentException("User not found with ID: 999"))
                .when(userProfileService).updateProfileCompletionStatus(999L);

        // Execute & Verify
        mockMvc.perform(post("/api/profile/999/update-completion"))
                .andExpect(status().isNotFound());
    }
}