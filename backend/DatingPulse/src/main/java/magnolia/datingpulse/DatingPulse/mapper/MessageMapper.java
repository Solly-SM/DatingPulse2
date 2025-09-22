package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Message;
import magnolia.datingpulse.DatingPulse.dto.MessageDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(source = "conversation.conversationID", target = "conversationID")
    @Mapping(source = "sender.userID", target = "senderID")
    @Mapping(source = "receiver.userID", target = "receiverID")
    @Mapping(source = "messageType", target = "type")
    @Mapping(source = "sentAt", target = "sentAt")
    @Mapping(source = "deliveredAt", target = "deliveredAt")
    @Mapping(source = "readAt", target = "readAt")
    MessageDTO toDTO(Message entity);

    @Mapping(target = "conversation", ignore = true) // Set in service
    @Mapping(target = "sender", ignore = true) // Set in service
    @Mapping(target = "receiver", ignore = true) // Set in service
    @Mapping(source = "type", target = "messageType")
    @Mapping(target = "sentAt", ignore = true) // Auto-generated timestamp
    @Mapping(target = "deliveredAt", ignore = true) // Set by delivery service
    @Mapping(target = "readAt", ignore = true) // Set when message is read
    Message toEntity(MessageDTO dto);
}