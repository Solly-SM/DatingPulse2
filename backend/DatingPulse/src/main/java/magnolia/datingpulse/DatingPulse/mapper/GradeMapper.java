package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Grade;
import magnolia.datingpulse.DatingPulse.dto.GradeDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface GradeMapper {
    @Mapping(source = "userGiven.userID", target = "userGivenID")
    @Mapping(source = "userReceived.userID", target = "userReceivedID")
    GradeDTO toDTO(Grade entity);

    // For DTO→entity: set userGiven and userReceived in service
    Grade toEntity(GradeDTO dto);
}