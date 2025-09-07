package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.ProfileVerification;
import magnolia.datingpulse.DatingPulse.dto.ProfileVerificationDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProfileVerificationMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(source = "reviewer.userID", target = "reviewerID")
    ProfileVerificationDTO toDTO(ProfileVerification entity);

    // For DTO→entity: set user and reviewer in service
    ProfileVerification toEntity(ProfileVerificationDTO dto);
}