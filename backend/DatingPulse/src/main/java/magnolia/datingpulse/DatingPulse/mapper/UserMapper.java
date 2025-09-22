package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    // Convert Entity to DTO - ignore sensitive fields
    @Mapping(target = "isVerified", source = "isVerified")
    UserDTO toDTO(User entity);
    
    // Convert DTO to Entity - ignore fields that should be set separately or auto-generated
    // Password-related mappings removed since passwords are no longer used
    @Mapping(target = "emailVerified", ignore = true) // Set by verification service
    @Mapping(target = "phoneVerified", ignore = true) // Set by verification service
    @Mapping(target = "loginAttempt", ignore = true) // Transient field managed by service
    @Mapping(target = "createdAt", ignore = true) // Auto-generated
    @Mapping(target = "updatedAt", ignore = true) // Auto-generated
    @Mapping(target = "lastLogin", ignore = true) // Set by authentication service
    @Mapping(target = "isVerified", ignore = true) // Set by verification service
    User toEntity(UserDTO dto);
}