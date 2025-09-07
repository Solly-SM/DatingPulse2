package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.dto.PhotoDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PhotoMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(source = "visibility", target = "visibility")
    @Mapping(source = "status", target = "status")
    PhotoDTO toDTO(Photo entity);

    // For DTO→entity: set user in service
    Photo toEntity(PhotoDTO dto);
}