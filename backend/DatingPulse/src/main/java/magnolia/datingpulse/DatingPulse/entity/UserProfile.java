package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @Column(name = "user_id")
    private Long userID;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String firstname;
    private String lastname;
    private Integer age;

    @Column(nullable = false)
    private String gender; // male, female, other

    private LocalDate dob;

    @Column(length = 1024)
    private String bio;

    private String pp; // Profile picture URL
    private String avatarThumbnail; // Thumbnail URL

    private String country;
    private String region;
    private String city;
    private Double latitude;
    private Double longitude;

    @ManyToMany
    @JoinTable(
            name = "user_interests",
            joinColumns = @JoinColumn(name = "user_profile_id"),
            inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private Set<Interest> interests;

    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL)
    private Preference preference;

    private LocalDateTime lastSeen;

    private String education;
    private String jobTitle;

    private String relationship; // single, complicated, open

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrivacyLevel privacy; // Use enum for privacy
}