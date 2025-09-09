package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Session;
import magnolia.datingpulse.DatingPulse.dto.SessionDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SessionMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(source = "token", target = "sessionID")
    @Mapping(source = "userAgent", target = "deviceInfo")
    @Mapping(target = "revokedAt", ignore = true) // Not used in new entity
    SessionDTO toDTO(Session entity);

    // For DTO→entity: set user in service
    @Mapping(source = "sessionID", target = "token")
    @Mapping(source = "deviceInfo", target = "userAgent")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "sessionID", ignore = true) // Auto-generated
    @Mapping(target = "ipAddress", ignore = true) // Set in service
    @Mapping(target = "isActive", ignore = true) // Set in service
    Session toEntity(SessionDTO dto);
}