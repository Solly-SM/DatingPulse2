package magnolia.datingpulse.DatingPulse.entity;

public enum PhotoStatus {
    PENDING,    // Newly uploaded, awaiting moderation
    ACTIVE,     // Approved and visible
    FLAGGED,    // Reported by users, under review
    REJECTED,   // Failed moderation, not visible
    REMOVED     // Deleted by user or admin
}