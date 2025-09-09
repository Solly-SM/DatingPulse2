package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoID;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(name = "url", nullable = false, length = 500)
    @NotBlank(message = "Photo URL is required")
    @Pattern(regexp = "^(https?://).*\\.(jpg|jpeg|png|gif|webp)$", 
             message = "URL must be a valid image file URL (jpg, jpeg, png, gif, webp)")
    private String url;

    @Column(name = "caption", columnDefinition = "TEXT")
    @Size(max = 500, message = "Caption must not exceed 500 characters")
    private String caption; // Legacy field
    
    @Column(name = "description", columnDefinition = "TEXT")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description; // Main description field expected by tests

    @Column(name = "display_order")
    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder; // Changed from orderIndex to match schema

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private PhotoStatus status; // Moderation status

    @Column(name = "visibility", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Visibility is required")
    private PhotoVisibility visibility;

    @Column(name = "uploaded_at", nullable = false)
    @NotNull(message = "Upload date is required")
    private LocalDateTime uploadedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "is_primary", nullable = false)
    @NotNull(message = "Primary photo status is required")
    @Builder.Default
    private Boolean isPrimary = false; // Changed from isProfilePhoto to match schema
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // Added to match test expectations
    
    // Helper methods for backwards compatibility with tests
    public Boolean getIsProfilePhoto() {
        return isPrimary;
    }
    
    public void setIsProfilePhoto(Boolean isProfilePhoto) {
        this.isPrimary = isProfilePhoto;
    }
    
    // Derive isPrivate from visibility for backwards compatibility
    public Boolean getIsPrivate() {
        return visibility == PhotoVisibility.PRIVATE;
    }
    
    public void setIsPrivate(Boolean isPrivate) {
        this.visibility = (isPrivate != null && isPrivate) ? PhotoVisibility.PRIVATE : PhotoVisibility.PUBLIC;
    }
    
    // Static builder method with backwards compatibility
    public static PhotoBuilder customBuilder() {
        return new PhotoBuilder() {
            public PhotoBuilder isProfilePhoto(Boolean isProfilePhoto) {
                return isPrimary(isProfilePhoto);
            }
            
            public PhotoBuilder isPrivate(Boolean isPrivate) {
                return visibility(isPrivate != null && isPrivate ? PhotoVisibility.PRIVATE : PhotoVisibility.PUBLIC);
            }
        };
    }
    
    // Override builder() method to return our custom builder
    public static PhotoBuilder builder() {
        return customBuilder();
    }
}