package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Permission;
import magnolia.datingpulse.DatingPulse.dto.PermissionDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    PermissionDTO toDTO(Permission entity);
    Permission toEntity(PermissionDTO dto);
}