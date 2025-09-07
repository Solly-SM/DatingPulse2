package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Conversation;
import magnolia.datingpulse.DatingPulse.dto.ConversationDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ConversationMapper {
    @Mapping(source = "match.id", target = "matchID")
    @Mapping(source = "lastMessage.messageID", target = "lastMessageID")
    ConversationDTO toDTO(Conversation entity);

    // For DTO→entity: set match and lastMessage in service
    Conversation toEntity(ConversationDTO dto);
}