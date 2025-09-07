package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Like;
import magnolia.datingpulse.DatingPulse.dto.LikeDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LikeMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(source = "likedUser.userID", target = "likedUserID")
    @Mapping(source = "type", target = "type")
    LikeDTO toDTO(Like entity);

    // For DTO→entity: set user and likedUser in service
    Like toEntity(LikeDTO dto);
}