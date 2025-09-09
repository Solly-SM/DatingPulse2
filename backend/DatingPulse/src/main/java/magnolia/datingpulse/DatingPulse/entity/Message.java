package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_conversation_sent_at", columnList = "conversation_id, sent_at"),
    @Index(name = "idx_sender_sent_at", columnList = "sender_id, sent_at"),
    @Index(name = "idx_receiver_sent_at", columnList = "receiver_id, sent_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    @NotNull(message = "Conversation is required")
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    @NotNull(message = "Sender is required")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    @NotNull(message = "Receiver is required")
    private User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Message content is required")
    @Size(max = 5000, message = "Message content must not exceed 5000 characters")
    private String content; // Message text or media link

    @Column(name = "message_type", nullable = false, length = 20)
    @NotBlank(message = "Message type is required")
    @Pattern(regexp = "^(TEXT|IMAGE|AUDIO|VIDEO|LOCATION|EMOJI)$", message = "Message type must be TEXT, IMAGE, AUDIO, VIDEO, LOCATION, or EMOJI")
    private String messageType;

    @Column(name = "sent_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime sentAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Message status is required")
    @Pattern(regexp = "^(SENT|DELIVERED|READ|FAILED)$", message = "Message status must be SENT, DELIVERED, READ, or FAILED")
    private String status;

    @Column(nullable = false)
    @NotNull(message = "Edited status is required")
    @Builder.Default
    private Boolean isEdited = false;

    @Column(nullable = false)
    @NotNull(message = "Read status is required")
    @Builder.Default
    private Boolean isRead = false;

    @Column(nullable = false)
    @NotNull(message = "Deleted for sender status is required")
    @Builder.Default
    private Boolean deletedForSender = false;

    @Column(nullable = false)
    @NotNull(message = "Deleted for receiver status is required")
    @Builder.Default
    private Boolean deletedForReceiver = false;

    // Getter method for backwards compatibility with service layer
    public String getType() {
        return messageType;
    }
    
    // Setter method for backwards compatibility with service layer  
    public void setType(String type) {
        this.messageType = type;
    }
}
