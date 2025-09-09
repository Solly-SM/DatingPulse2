package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Admin;
import magnolia.datingpulse.DatingPulse.dto.AdminDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    @Mapping(source = "user.userID", target = "userID")
    @Mapping(target = "permissionIDs", expression = "java(admin.getPermissions() != null ? java.util.Arrays.stream(admin.getPermissions()).map(Long::valueOf).collect(java.util.stream.Collectors.toSet()) : null)")
    @Mapping(target = "role", constant = "ADMIN") // Default role since it's not in entity
    AdminDTO toDTO(Admin admin);

    // For DTO→entity: set user and permissions in service
    @Mapping(target = "permissions", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Admin toEntity(AdminDTO dto);
}