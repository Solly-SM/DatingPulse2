package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PhotoDTO;
import magnolia.datingpulse.DatingPulse.service.PhotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
@Validated
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping
    public ResponseEntity<PhotoDTO> uploadPhoto(@Valid @RequestBody PhotoDTO photoDTO) {
        try {
            PhotoDTO uploadedPhoto = photoService.createPhoto(photoDTO);
            return new ResponseEntity<>(uploadedPhoto, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{photoId}")
    public ResponseEntity<PhotoDTO> getPhotoById(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId) {
        try {
            PhotoDTO photo = photoService.getPhotoById(photoId);
            return ResponseEntity.ok(photo);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PhotoDTO>> getPhotosByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<PhotoDTO> photos = photoService.getPhotosByUser(userId);
        return ResponseEntity.ok(photos);
    }

    @PutMapping("/{photoId}")
    public ResponseEntity<PhotoDTO> updatePhoto(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId,
            @Valid @RequestBody PhotoDTO photoDTO) {
        try {
            PhotoDTO updatedPhoto = photoService.updatePhoto(photoId, photoDTO);
            return ResponseEntity.ok(updatedPhoto);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId) {
        try {
            photoService.deletePhoto(photoId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}