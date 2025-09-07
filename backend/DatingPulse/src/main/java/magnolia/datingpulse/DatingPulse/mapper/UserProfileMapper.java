package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(target = "interestIDs", expression = "java(userProfile.getInterests() != null ? userProfile.getInterests().stream().map(i -> i.getId()).collect(java.util.stream.Collectors.toSet()) : null)")
    @Mapping(source = "preference.id", target = "preferenceID")
    UserProfileDTO toDTO(UserProfile userProfile);

    // For DTO→entity: set user, interests, preference in service
    UserProfile toEntity(UserProfileDTO dto);
}