package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Preference;
import magnolia.datingpulse.DatingPulse.dto.PreferenceDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PreferenceMapper {
    @Mapping(source = "userProfile.userID", target = "userProfileID")
    PreferenceDTO toDTO(Preference entity);

    // For DTO→entity: set userProfile in service
    Preference toEntity(PreferenceDTO dto);
}