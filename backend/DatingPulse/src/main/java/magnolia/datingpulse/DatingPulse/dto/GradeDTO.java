package magnolia.datingpulse.DatingPulse.dto;

import lombok.Data;

@Data
public class GradeDTO {
    private Long gradeID;
    private Long userGivenID;
    private Long userReceivedID;
    private Integer grade;
}