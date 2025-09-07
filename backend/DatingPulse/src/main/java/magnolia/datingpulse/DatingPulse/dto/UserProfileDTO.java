package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserProfileDTO {
    private Long userID;
    private String firstname;
    private String lastname;
    private Integer age;
    private String gender;
    private LocalDate dob;
    private String bio;
    private String pp;
    private String avatarThumbnail;
    private String country;
    private String region;
    private String city;
    private Double latitude;
    private Double longitude;
    private Set<Long> interestIDs;
    private Long preferenceID;
    private LocalDateTime lastSeen;
    private String education;
    private String jobTitle;
    private String relationship;
    private String privacy;
}