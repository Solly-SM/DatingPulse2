package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Otp;
import magnolia.datingpulse.DatingPulse.dto.OtpDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface OtpMapper {
    @Mapping(source = "user.userID", target = "userID")
    OtpDTO toDTO(Otp entity);

    // For DTO→entity: set user in service
    Otp toEntity(OtpDTO dto);
}