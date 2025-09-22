package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Like;
import magnolia.datingpulse.DatingPulse.dto.LikeDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LikeMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(source = "likedUser.userID", target = "likedUserID")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "likedAt", target = "likedAt")
    LikeDTO toDTO(Like entity);

    @Mapping(target = "user", ignore = true) // Set in service
    @Mapping(target = "likedUser", ignore = true) // Set in service
    @Mapping(target = "likedAt", ignore = true) // Auto-generated timestamp
    Like toEntity(LikeDTO dto);
}