package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.SwipeHistory;
import magnolia.datingpulse.DatingPulse.dto.SwipeHistoryDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SwipeHistoryMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(source = "targetUser.userID", target = "targetUserID")
    @Mapping(source = "device.deviceID", target = "deviceID")
    @Mapping(source = "session.sessionID", target = "sessionID")
    SwipeHistoryDTO toDTO(SwipeHistory entity);

    // For DTO→entity: set user, targetUser, device, session in service
    SwipeHistory toEntity(SwipeHistoryDTO dto);
}