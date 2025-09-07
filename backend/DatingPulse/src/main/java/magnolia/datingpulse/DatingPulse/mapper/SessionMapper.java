package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Session;
import magnolia.datingpulse.DatingPulse.dto.SessionDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SessionMapper {
    @Mapping(source = "user.userID", target = "userID")
    SessionDTO toDTO(Session entity);

    // For DTO→entity: set user in service
    Session toEntity(SessionDTO dto);
}