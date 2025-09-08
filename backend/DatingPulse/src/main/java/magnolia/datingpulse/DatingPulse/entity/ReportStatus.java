package magnolia.datingpulse.DatingPulse.entity;

public enum ReportStatus {
    PENDING,     // Report submitted, awaiting review
    REVIEWING,   // Under investigation
    RESOLVED,    // Action taken, report closed
    DISMISSED    // No action needed, report closed
}