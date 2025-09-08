package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "Profile verification data transfer object")
public class ProfileVerificationDTO {
    @Schema(description = "Unique identifier for the verification", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long verificationID;
    
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    @Schema(description = "ID of the user requesting verification", example = "1")
    private Long userID;
    
    @NotBlank(message = "Verification type is required")
    @Pattern(regexp = "^(PHOTO|ID|SOCIAL|PHONE|EMAIL|MANUAL)$", 
             message = "Type must be PHOTO, ID, SOCIAL, PHONE, EMAIL, or MANUAL")
    @Schema(description = "Type of verification", example = "PHOTO", 
            allowableValues = {"PHOTO", "ID", "SOCIAL", "PHONE", "EMAIL", "MANUAL"})
    private String type;
    
    @NotBlank(message = "Verification status is required")
    @Pattern(regexp = "^(PENDING|APPROVED|REJECTED|EXPIRED)$", 
             message = "Status must be PENDING, APPROVED, REJECTED, or EXPIRED")
    @Schema(description = "Current status of verification", example = "PENDING", 
            allowableValues = {"PENDING", "APPROVED", "REJECTED", "EXPIRED"})
    private String status;
    
    @Schema(description = "When verification was requested", example = "2024-01-15T10:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime requestedAt;
    
    @Schema(description = "When verification was approved", example = "2024-01-15T14:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime verifiedAt;
    
    @Schema(description = "When verification was rejected", example = "2024-01-15T14:30:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime rejectedAt;
    
    @Pattern(regexp = "^https://.*\\.(jpg|jpeg|png|pdf|doc|docx)$", 
             message = "Document URL must be HTTPS and end with valid file extension (jpg, jpeg, png, pdf, doc, docx)")
    @Schema(description = "URL of the verification document", example = "https://example.com/docs/id.jpg")
    private String documentURL;
    
    @Positive(message = "Reviewer ID must be positive when provided")
    @Schema(description = "ID of the admin who reviewed the verification", example = "1")
    private Long reviewerID;
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    @Schema(description = "Reviewer notes", example = "Photo is clear and shows face clearly", maxLength = 1000)
    private String notes;
}