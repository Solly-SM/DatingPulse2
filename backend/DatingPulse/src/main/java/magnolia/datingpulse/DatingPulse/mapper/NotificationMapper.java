package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Notification;
import magnolia.datingpulse.DatingPulse.dto.NotificationDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "user.userID", target = "userID")
    NotificationDTO toDTO(Notification entity);

    // For DTO→entity: set user in service
    Notification toEntity(NotificationDTO dto);
}