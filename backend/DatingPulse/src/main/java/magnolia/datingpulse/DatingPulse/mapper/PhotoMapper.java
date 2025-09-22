package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.dto.PhotoDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PhotoMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(source = "isPrimary", target = "isProfilePhoto")
    @Mapping(source = "displayOrder", target = "orderIndex")
    @Mapping(source = "visibility", target = "visibility")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "isPrivate", expression = "java(entity.getVisibility() == magnolia.datingpulse.DatingPulse.entity.PhotoVisibility.PRIVATE)")
    PhotoDTO toDTO(Photo entity);

    @Mapping(target = "user", ignore = true) // Set in service
    @Mapping(target = "isPrimary", source = "isProfilePhoto")
    @Mapping(target = "displayOrder", source = "orderIndex")
    @Mapping(target = "visibility", expression = "java(dto.getIsPrivate() != null && dto.getIsPrivate() ? magnolia.datingpulse.DatingPulse.entity.PhotoVisibility.PRIVATE : magnolia.datingpulse.DatingPulse.entity.PhotoVisibility.PUBLIC)")
    @Mapping(target = "status", expression = "java(dto.getStatus() != null ? magnolia.datingpulse.DatingPulse.entity.PhotoStatus.valueOf(dto.getStatus()) : magnolia.datingpulse.DatingPulse.entity.PhotoStatus.PENDING)")
    @Mapping(target = "caption", source = "description") // Map description to caption for legacy support
    @Mapping(target = "approvedAt", ignore = true) // Set by moderation service
    @Mapping(target = "dimensions", ignore = true) // Set by upload service
    @Mapping(target = "moderatedBy", ignore = true) // Set by moderation service
    Photo toEntity(PhotoDTO dto);
}