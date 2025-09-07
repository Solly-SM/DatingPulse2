package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_conversation_sent_at", columnList = "conversationID, sentAt"),
    @Index(name = "idx_sender_sent_at", columnList = "senderID, sentAt"),
    @Index(name = "idx_receiver_sent_at", columnList = "receiverID, sentAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversationID", nullable = false)
    @NotNull(message = "Conversation is required")
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "senderID", nullable = false)
    @NotNull(message = "Sender is required")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiverID", nullable = false)
    @NotNull(message = "Receiver is required")
    private User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Message content is required")
    @Size(max = 5000, message = "Message content must not exceed 5000 characters")
    private String content; // Message text or media link

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Message type is required")
    @Pattern(regexp = "^(TEXT|IMAGE|AUDIO|VIDEO|SYSTEM|FILE)$", message = "Message type must be TEXT, IMAGE, AUDIO, VIDEO, SYSTEM, or FILE")
    private String type;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime sentAt;

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
}
