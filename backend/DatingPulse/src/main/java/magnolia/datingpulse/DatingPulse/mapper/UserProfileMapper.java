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

    @Mapping(target = "user", ignore = true) // Set in service
    @Mapping(target = "maxDistance", ignore = true) // Not in DTO
    @Mapping(target = "showDistance", ignore = true) // Not in DTO
    @Mapping(target = "isProfileComplete", ignore = true) // Calculated field
    @Mapping(target = "createdAt", ignore = true) // Auto-generated
    @Mapping(target = "updatedAt", ignore = true) // Auto-generated
    @Mapping(target = "interests", ignore = true) // Set in service
    @Mapping(target = "preference", ignore = true) // Set in service
    UserProfile toEntity(UserProfileDTO dto);
}