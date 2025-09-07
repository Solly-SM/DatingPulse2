package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Message;
import magnolia.datingpulse.DatingPulse.dto.MessageDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(source = "conversation.conversationID", target = "conversationID")
    @Mapping(source = "sender.userID", target = "senderID")
    @Mapping(source = "receiver.userID", target = "receiverID")
    MessageDTO toDTO(Message entity);

    // For DTO→entity: set conversation, sender, receiver in service
    Message toEntity(MessageDTO dto);
}