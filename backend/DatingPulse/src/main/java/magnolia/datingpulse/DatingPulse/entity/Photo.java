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
    @Pattern(regexp = "^(https?://.*|/uploads/.*)\\.(jpg|jpeg|png|gif|webp)$", 
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
    private Boolean isPrimary = false; // Primary photo status as per schema
    
    @Column(name = "dimensions", length = 20)
    @Size(max = 20, message = "Dimensions must not exceed 20 characters")
    @Pattern(regexp = "^\\d+x\\d+$", message = "Dimensions must be in format WIDTHxHEIGHT (e.g., 400x600)")
    private String dimensions; // Image dimensions as per schema
    
    @ManyToOne
    @JoinColumn(name = "moderated_by")
    private User moderatedBy; // Admin who moderated this photo as per schema
    
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
    
    public Integer getOrderIndex() {
        return displayOrder;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.displayOrder = orderIndex;
    }
    
    // Custom builder class that extends Lombok's PhotoBuilder
    public static class PhotoBuilder {
        private Long photoID;
        private User user;
        private String url;
        private String caption;
        private String description;
        private Integer displayOrder;
        private PhotoStatus status;
        private PhotoVisibility visibility;
        private LocalDateTime uploadedAt;
        private LocalDateTime approvedAt;
        private Boolean isPrimary = false;
        private LocalDateTime updatedAt;
        private String dimensions;
        private User moderatedBy;
        
        PhotoBuilder() {}
        
        public PhotoBuilder photoID(Long photoID) {
            this.photoID = photoID;
            return this;
        }
        
        public PhotoBuilder user(User user) {
            this.user = user;
            return this;
        }
        
        public PhotoBuilder url(String url) {
            this.url = url;
            return this;
        }
        
        public PhotoBuilder caption(String caption) {
            this.caption = caption;
            return this;
        }
        
        public PhotoBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public PhotoBuilder displayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }
        
        public PhotoBuilder status(PhotoStatus status) {
            this.status = status;
            return this;
        }
        
        public PhotoBuilder visibility(PhotoVisibility visibility) {
            this.visibility = visibility;
            return this;
        }
        
        public PhotoBuilder uploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
            return this;
        }
        
        public PhotoBuilder approvedAt(LocalDateTime approvedAt) {
            this.approvedAt = approvedAt;
            return this;
        }
        
        public PhotoBuilder isPrimary(Boolean isPrimary) {
            this.isPrimary = isPrimary;
            return this;
        }
        
        public PhotoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public PhotoBuilder dimensions(String dimensions) {
            this.dimensions = dimensions;
            return this;
        }
        
        public PhotoBuilder moderatedBy(User moderatedBy) {
            this.moderatedBy = moderatedBy;
            return this;
        }
        
        // Backwards compatibility methods
        public PhotoBuilder isProfilePhoto(Boolean isProfilePhoto) {
            this.isPrimary = isProfilePhoto;
            return this;
        }
        
        public PhotoBuilder isPrivate(Boolean isPrivate) {
            this.visibility = (isPrivate != null && isPrivate) ? PhotoVisibility.PRIVATE : PhotoVisibility.PUBLIC;
            return this;
        }
        
        public PhotoBuilder orderIndex(Integer orderIndex) {
            this.displayOrder = orderIndex;
            return this;
        }
        
        public Photo build() {
            Photo photo = new Photo();
            photo.photoID = this.photoID;
            photo.user = this.user;
            photo.url = this.url;
            photo.caption = this.caption;
            photo.description = this.description;
            photo.displayOrder = this.displayOrder;
            photo.status = this.status;
            photo.visibility = this.visibility;
            photo.uploadedAt = this.uploadedAt;
            photo.approvedAt = this.approvedAt;
            photo.isPrimary = this.isPrimary;
            photo.updatedAt = this.updatedAt;
            photo.dimensions = this.dimensions;
            photo.moderatedBy = this.moderatedBy;
            return photo;
        }
    }
    
    // Static builder method
    public static PhotoBuilder builder() {
        return new PhotoBuilder();
    }
}