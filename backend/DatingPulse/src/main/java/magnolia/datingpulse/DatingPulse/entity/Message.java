package magnolia.datingpulse.DatingPulse.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageID;

    @ManyToOne
    @JoinColumn(name = "conversationID", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "senderID", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiverID", nullable = false)
    private User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // Message text or media link

    @Column(nullable = false)
    private String type; // text, image, audio, video, system

    @Column(nullable = false)
    private LocalDateTime sentAt;

    @Column(nullable = false)
    private String status; // sent, delivered, read

    @Column(nullable = false)
    private Boolean isEdited;

    @Column(nullable = false)
    private Boolean isRead;

    @Column(nullable = false)
    private Boolean deletedForSender;

    @Column(nullable = false)
    private Boolean deletedForReceiver;
}
