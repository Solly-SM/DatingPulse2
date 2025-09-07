package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Interest;
import magnolia.datingpulse.DatingPulse.dto.InterestDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InterestMapper {
    InterestDTO toDTO(Interest entity);
    Interest toEntity(InterestDTO dto);
}