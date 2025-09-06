package magnolia.datingpulse.DatingPulse.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversationID;

    @ManyToOne
    @JoinColumn(name = "matchID", nullable = false)
    private Match match; // Related match for this conversation

    @Column(nullable = false)
    private LocalDateTime startedAt;

    @OneToOne
    @JoinColumn(name = "lastMessageID")
    private Message lastMessage; // Latest message’s ID in this conversation

    private Boolean deletedForUser1; // If user1 deleted the convo
    private Boolean deletedForUser2; // If user2 deleted the convo
}