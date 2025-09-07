package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GradeDTO {
    private Long gradeID;
    
    @NotNull(message = "User who gave the grade ID is required")
    @Positive(message = "User who gave the grade ID must be positive")
    private Long userGivenID;
    
    @NotNull(message = "User who received the grade ID is required")
    @Positive(message = "User who received the grade ID must be positive")
    private Long userReceivedID;
    
    @NotNull(message = "Grade value is required")
    @Min(value = 1, message = "Grade must be at least 1")
    @Max(value = 5, message = "Grade must not exceed 5")
    private Integer grade;
}