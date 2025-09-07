package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.BlockedUser;
import magnolia.datingpulse.DatingPulse.dto.BlockedUserDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BlockedUserMapper {
    @Mapping(source = "blocker.userID", target = "blockerID")
    @Mapping(source = "blocked.userID", target = "blockedID")
    BlockedUserDTO toDTO(BlockedUser entity);

    // For DTO→entity: set blocker and blocked in service
    BlockedUser toEntity(BlockedUserDTO dto);
}