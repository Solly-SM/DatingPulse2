package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Device;
import magnolia.datingpulse.DatingPulse.dto.DeviceDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DeviceMapper {
    @Mapping(source = "user.userID", target = "userID")
    DeviceDTO toDTO(Device entity);

    // For DTO→entity: set user in service
    Device toEntity(DeviceDTO dto);
}