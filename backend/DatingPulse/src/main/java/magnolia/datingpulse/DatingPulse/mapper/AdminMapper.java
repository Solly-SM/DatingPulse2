package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Admin;
import magnolia.datingpulse.DatingPulse.dto.AdminDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(target = "permissionIDs", expression = "java(admin.getPermissions() != null ? admin.getPermissions().stream().map(p -> p.getId()).collect(java.util.stream.Collectors.toSet()) : null)")
    AdminDTO toDTO(Admin admin);

    // For DTO→entity: set user and permissions in service
    Admin toEntity(AdminDTO dto);
}