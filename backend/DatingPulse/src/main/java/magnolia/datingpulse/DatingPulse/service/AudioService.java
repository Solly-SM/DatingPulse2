package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.AudioDTO;
import magnolia.datingpulse.DatingPulse.entity.Audio;
import magnolia.datingpulse.DatingPulse.entity.AudioStatus;
import magnolia.datingpulse.DatingPulse.entity.AudioVisibility;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.mapper.AudioMapper;
import magnolia.datingpulse.DatingPulse.repositories.AudioRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AudioService {
    private final AudioRepository audioRepository;
    private final UserProfileRepository userProfileRepository;
    private final AudioMapper audioMapper;

    @Transactional
    public AudioDTO createAudio(AudioDTO audioDTO) {
        // Validate user profile exists
        UserProfile userProfile = userProfileRepository.findById(audioDTO.getUserProfileID())
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + audioDTO.getUserProfileID()));

        // Validate audio data
        validateAudioData(audioDTO);

        // Map DTO to entity
        Audio audio = audioMapper.toEntity(audioDTO);
        audio.setUserProfile(userProfile);

        // Set default values
        if (audio.getStatus() == null) {
            audio.setStatus(AudioStatus.ACTIVE); // Default status
        }
        if (audio.getVisibility() == null) {
            audio.setVisibility(AudioVisibility.PUBLIC);
        }
        audio.setUploadedAt(LocalDateTime.now());
        audio.setUpdatedAt(LocalDateTime.now());

        Audio saved = audioRepository.save(audio);
        return audioMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public AudioDTO getAudioById(Long id) {
        Audio audio = audioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Audio not found with ID: " + id));
        return audioMapper.toDTO(audio);
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getAudiosByUserProfile(Long userProfileId) {
        UserProfile userProfile = userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userProfileId));
        
        List<Audio> audios = audioRepository.findByUserProfile(userProfile);
        return audios.stream()
                .map(audioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getAudiosByStatus(String status) {
        if (!isValidAudioStatus(status)) {
            throw new IllegalArgumentException("Invalid audio status: " + status);
        }
        
        AudioStatus audioStatus = AudioStatus.valueOf(status.toUpperCase());
        List<Audio> audios = audioRepository.findByStatus(audioStatus);
        return audios.stream()
                .map(audioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getAudiosByVisibility(String visibility) {
        if (!isValidAudioVisibility(visibility)) {
            throw new IllegalArgumentException("Invalid audio visibility: " + visibility);
        }
        
        AudioVisibility audioVisibility = AudioVisibility.valueOf(visibility.toUpperCase());
        List<Audio> audios = audioRepository.findByVisibility(audioVisibility);
        return audios.stream()
                .map(audioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getActiveAudios() {
        return getAudiosByStatus("ACTIVE");
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getFlaggedAudios() {
        return getAudiosByStatus("FLAGGED");
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getRemovedAudios() {
        return getAudiosByStatus("REMOVED");
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getPublicAudios() {
        return getAudiosByVisibility("PUBLIC");
    }

    @Transactional
    public AudioDTO updateAudio(Long id, AudioDTO audioDTO) {
        Audio existing = audioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Audio not found with ID: " + id));

        // Validate updates
        validateAudioData(audioDTO);

        // Update fields if provided
        if (audioDTO.getUrl() != null) {
            existing.setUrl(audioDTO.getUrl());
        }
        if (audioDTO.getDescription() != null) {
            existing.setDescription(audioDTO.getDescription());
        }
        if (audioDTO.getVisibility() != null && isValidAudioVisibility(audioDTO.getVisibility())) {
            existing.setVisibility(AudioVisibility.valueOf(audioDTO.getVisibility().toUpperCase()));
        }
        if (audioDTO.getStatus() != null && isValidAudioStatus(audioDTO.getStatus())) {
            existing.setStatus(AudioStatus.valueOf(audioDTO.getStatus().toUpperCase()));
        }
        if (audioDTO.getDuration() != null) {
            existing.setDuration(audioDTO.getDuration());
        }

        existing.setUpdatedAt(LocalDateTime.now());

        Audio updated = audioRepository.save(existing);
        return audioMapper.toDTO(updated);
    }

    @Transactional
    public AudioDTO activateAudio(Long id) {
        Audio audio = audioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Audio not found with ID: " + id));

        audio.setStatus(AudioStatus.ACTIVE);
        audio.setUpdatedAt(LocalDateTime.now());

        Audio updated = audioRepository.save(audio);
        return audioMapper.toDTO(updated);
    }

    @Transactional
    public AudioDTO removeAudio(Long id) {
        Audio audio = audioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Audio not found with ID: " + id));

        audio.setStatus(AudioStatus.REMOVED);
        audio.setUpdatedAt(LocalDateTime.now());

        Audio updated = audioRepository.save(audio);
        return audioMapper.toDTO(updated);
    }

    @Transactional
    public AudioDTO flagAudio(Long id) {
        Audio audio = audioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Audio not found with ID: " + id));

        audio.setStatus(AudioStatus.FLAGGED);
        audio.setUpdatedAt(LocalDateTime.now());

        Audio updated = audioRepository.save(audio);
        return audioMapper.toDTO(updated);
    }

    @Transactional
    public void deleteAudio(Long id) {
        if (!audioRepository.existsById(id)) {
            throw new IllegalArgumentException("Audio not found with ID: " + id);
        }
        audioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getAudiosByUserProfileAndStatus(Long userProfileId, String status) {
        UserProfile userProfile = userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userProfileId));
        
        if (!isValidAudioStatus(status)) {
            throw new IllegalArgumentException("Invalid audio status: " + status);
        }
        
        AudioStatus audioStatus = AudioStatus.valueOf(status.toUpperCase());
        List<Audio> audios = audioRepository.findByUserProfileAndStatus(userProfile, audioStatus);
        return audios.stream()
                .map(audioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AudioDTO> getAudiosByUserProfileAndVisibility(Long userProfileId, String visibility) {
        UserProfile userProfile = userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userProfileId));
        
        if (!isValidAudioVisibility(visibility)) {
            throw new IllegalArgumentException("Invalid audio visibility: " + visibility);
        }
        
        AudioVisibility audioVisibility = AudioVisibility.valueOf(visibility.toUpperCase());
        List<Audio> audios = audioRepository.findByUserProfileAndVisibility(userProfile, audioVisibility);
        return audios.stream()
                .map(audioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getTotalAudioCount() {
        return audioRepository.count();
    }

    @Transactional(readOnly = true)
    public long getAudioCountByStatus(String status) {
        if (!isValidAudioStatus(status)) {
            throw new IllegalArgumentException("Invalid audio status: " + status);
        }
        
        AudioStatus audioStatus = AudioStatus.valueOf(status.toUpperCase());
        return audioRepository.countByStatus(audioStatus);
    }

    @Transactional(readOnly = true)
    public long getAudioCountByUserProfile(Long userProfileId) {
        UserProfile userProfile = userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userProfileId));
        
        return audioRepository.countByUserProfile(userProfile);
    }

    /**
     * Validates audio data
     */
    private void validateAudioData(AudioDTO audioDTO) {
        if (audioDTO.getUrl() == null || audioDTO.getUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("Audio URL is required");
        }

        // Validate URL format (basic check)
        if (!isValidUrl(audioDTO.getUrl())) {
            throw new IllegalArgumentException("Invalid audio URL format");
        }

        // Validate duration if provided
        if (audioDTO.getDuration() != null && audioDTO.getDuration() <= 0) {
            throw new IllegalArgumentException("Audio duration must be positive");
        }

        // Validate description length if provided
        if (audioDTO.getDescription() != null && audioDTO.getDescription().length() > 500) {
            throw new IllegalArgumentException("Audio description cannot exceed 500 characters");
        }

        // Validate status if provided
        if (audioDTO.getStatus() != null && !isValidAudioStatus(audioDTO.getStatus())) {
            throw new IllegalArgumentException("Invalid audio status: " + audioDTO.getStatus());
        }

        // Validate visibility if provided
        if (audioDTO.getVisibility() != null && !isValidAudioVisibility(audioDTO.getVisibility())) {
            throw new IllegalArgumentException("Invalid audio visibility: " + audioDTO.getVisibility());
        }
    }

    /**
     * Validates audio status
     */
    private boolean isValidAudioStatus(String status) {
        if (status == null) return false;
        try {
            AudioStatus.valueOf(status.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Validates audio visibility
     */
    private boolean isValidAudioVisibility(String visibility) {
        if (visibility == null) return false;
        try {
            AudioVisibility.valueOf(visibility.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Basic URL validation
     */
    private boolean isValidUrl(String url) {
        return url.matches("^(http|https|ftp)://.*$") || url.matches("^/.*$"); // Allow relative URLs too
    }
}