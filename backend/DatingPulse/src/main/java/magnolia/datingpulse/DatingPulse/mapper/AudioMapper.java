package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Audio;
import magnolia.datingpulse.DatingPulse.dto.AudioDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AudioMapper {
    @Mapping(source = "audioID", target = "id")
    @Mapping(source = "userProfile.userID", target = "userProfileID")
    @Mapping(source = "title", target = "description") // Map title to description
    @Mapping(source = "visibility", target = "visibility")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "updatedAt", ignore = true) // No updatedAt field in entity
    AudioDTO toDTO(Audio audio);

    @Mapping(source = "id", target = "audioID")
    @Mapping(source = "description", target = "title") // Map description to title
    @Mapping(target = "userProfile", ignore = true) // Set in service
    @Mapping(target = "uploadedAt", ignore = true) // Set in service
    Audio toEntity(AudioDTO dto);
}