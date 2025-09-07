package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    // Convert Entity to DTO - ignore sensitive fields
    UserDTO toDTO(User entity);
    
    // Convert DTO to Entity - ignore fields that should be set separately or auto-generated
    @Mapping(target = "password", ignore = true) // Password should be set separately after hashing
    @Mapping(target = "loginAttempt", ignore = true) // Security field, set to default
    @Mapping(target = "createdAt", ignore = true) // Auto-generated
    @Mapping(target = "updatedAt", ignore = true) // Auto-generated
    User toEntity(UserDTO dto);
}