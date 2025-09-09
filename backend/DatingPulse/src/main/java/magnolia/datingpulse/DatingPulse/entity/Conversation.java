package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @Column(name = "conversation_id")
    private Long conversationID;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    @NotNull(message = "Match is required")
    private Match match; // Related match for this conversation

    @Column(name = "started_at", nullable = false)
    @NotNull(message = "Start timestamp is required")
    private LocalDateTime startedAt;

    @OneToOne
    @JoinColumn(name = "last_message_id")
    private Message lastMessage; // Latest message’s ID in this conversation

    @Column(name = "deleted_for_user1")
    @NotNull(message = "Deleted status for user1 is required")
    @Builder.Default
    private Boolean deletedForUser1 = false; // If user1 deleted the convo
    
    @Column(name = "deleted_for_user2")
    @NotNull(message = "Deleted status for user2 is required")
    @Builder.Default
    private Boolean deletedForUser2 = false; // If user2 deleted the convo
}