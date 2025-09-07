package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Match;
import magnolia.datingpulse.DatingPulse.dto.MatchDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MatchMapper {
    @Mapping(source = "userOne.userID", target = "userOneID")
    @Mapping(source = "userTwo.userID", target = "userTwoID")
    MatchDTO toDTO(Match entity);

    // For DTO→entity: set userOne and userTwo in service
    Match toEntity(MatchDTO dto);
}