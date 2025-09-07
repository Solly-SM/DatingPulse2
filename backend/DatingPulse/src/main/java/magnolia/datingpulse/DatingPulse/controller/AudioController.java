package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.AudioDTO;
import magnolia.datingpulse.DatingPulse.service.AudioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audios")
@RequiredArgsConstructor
@Validated
public class AudioController {

    private final AudioService audioService;

    @PostMapping
    public ResponseEntity<AudioDTO> createAudio(@Valid @RequestBody AudioDTO audioDTO) {
        try {
            AudioDTO createdAudio = audioService.createAudio(audioDTO);
            return new ResponseEntity<>(createdAudio, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{audioId}")
    public ResponseEntity<AudioDTO> getAudioById(
            @PathVariable @Positive(message = "Audio ID must be positive") Long audioId) {
        try {
            AudioDTO audio = audioService.getAudioById(audioId);
            return ResponseEntity.ok(audio);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user-profile/{userProfileId}")
    public ResponseEntity<List<AudioDTO>> getAudiosByUserProfile(
            @PathVariable @Positive(message = "User profile ID must be positive") Long userProfileId) {
        List<AudioDTO> audios = audioService.getAudiosByUserProfile(userProfileId);
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/user-profile/{userProfileId}/visibility/{visibility}")
    public ResponseEntity<List<AudioDTO>> getAudiosByUserProfileAndVisibility(
            @PathVariable @Positive(message = "User profile ID must be positive") Long userProfileId,
            @PathVariable @NotBlank(message = "Visibility cannot be blank") String visibility) {
        List<AudioDTO> audios = audioService.getAudiosByUserProfileAndVisibility(userProfileId, visibility);
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AudioDTO>> getAudiosByStatus(
            @PathVariable @NotBlank(message = "Status cannot be blank") String status) {
        List<AudioDTO> audios = audioService.getAudiosByStatus(status);
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/visibility/{visibility}")
    public ResponseEntity<List<AudioDTO>> getAudiosByVisibility(
            @PathVariable @NotBlank(message = "Visibility cannot be blank") String visibility) {
        List<AudioDTO> audios = audioService.getAudiosByVisibility(visibility);
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/active")
    public ResponseEntity<List<AudioDTO>> getActiveAudios() {
        List<AudioDTO> audios = audioService.getActiveAudios();
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/flagged")
    public ResponseEntity<List<AudioDTO>> getFlaggedAudios() {
        List<AudioDTO> audios = audioService.getFlaggedAudios();
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/removed")
    public ResponseEntity<List<AudioDTO>> getRemovedAudios() {
        List<AudioDTO> audios = audioService.getRemovedAudios();
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/public")
    public ResponseEntity<List<AudioDTO>> getPublicAudios() {
        List<AudioDTO> audios = audioService.getPublicAudios();
        return ResponseEntity.ok(audios);
    }

    @GetMapping("/private")
    public ResponseEntity<List<AudioDTO>> getPrivateAudios() {
        List<AudioDTO> audios = audioService.getPrivateAudios();
        return ResponseEntity.ok(audios);
    }

    @GetMapping
    public ResponseEntity<List<AudioDTO>> getAllAudios() {
        List<AudioDTO> audios = audioService.getAllAudios();
        return ResponseEntity.ok(audios);
    }

    @PutMapping("/{audioId}")
    public ResponseEntity<AudioDTO> updateAudio(
            @PathVariable @Positive(message = "Audio ID must be positive") Long audioId,
            @Valid @RequestBody AudioDTO audioDTO) {
        try {
            AudioDTO updatedAudio = audioService.updateAudio(audioId, audioDTO);
            return ResponseEntity.ok(updatedAudio);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{audioId}")
    public ResponseEntity<Void> deleteAudio(
            @PathVariable @Positive(message = "Audio ID must be positive") Long audioId) {
        try {
            audioService.deleteAudio(audioId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/count/total")
    public ResponseEntity<Long> getTotalAudioCount() {
        long count = audioService.getTotalAudioCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> getAudioCountByStatus(
            @PathVariable @NotBlank(message = "Status cannot be blank") String status) {
        long count = audioService.getAudioCountByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/user-profile/{userProfileId}")
    public ResponseEntity<Long> getAudioCountByUserProfile(
            @PathVariable @Positive(message = "User profile ID must be positive") Long userProfileId) {
        long count = audioService.getAudioCountByUserProfile(userProfileId);
        return ResponseEntity.ok(count);
    }
}