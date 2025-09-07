package magnolia.datingpulse.DatingPulse.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Interest data transfer object containing interest information")
public class InterestDTO {
    @Schema(description = "Unique identifier for the interest", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @NotBlank(message = "Interest name is required")
    @Size(min = 2, max = 100, message = "Interest name must be between 2 and 100 characters")
    @Schema(description = "Name of the interest or hobby", example = "Photography", minLength = 2, maxLength = 100)
    private String name;
}