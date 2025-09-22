package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Audio;
import magnolia.datingpulse.DatingPulse.dto.AudioDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AudioMapper {
    @Mapping(source = "audioID", target = "id")
    @Mapping(source = "userProfile.userID", target = "userProfileID")
    @Mapping(source = "visibility", target = "visibility")
    @Mapping(source = "status", target = "status")
    AudioDTO toDTO(Audio audio);

    @Mapping(source = "id", target = "audioID")
    @Mapping(target = "userProfile", ignore = true) // Set in service
    Audio toEntity(AudioDTO dto);
}