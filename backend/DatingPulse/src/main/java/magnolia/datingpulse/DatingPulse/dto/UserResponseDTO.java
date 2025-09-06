package magnolia.datingpulse.DatingPulse.dto;

public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String status;

    // Constructors
    public UserResponseDTO() {}

    public UserResponseDTO(Long id, String username, String email, String status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.status = status;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}