package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PhotoDTO;
import magnolia.datingpulse.DatingPulse.service.PhotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    /**
     * Upload photo file (multipart/form-data)
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PhotoDTO> uploadPhotoFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") @Positive(message = "User ID must be positive") Long userId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "isProfilePhoto", defaultValue = "false") Boolean isProfilePhoto) {
        try {
            PhotoDTO uploadedPhoto = photoService.uploadPhoto(file, userId, description, isProfilePhoto);
            return new ResponseEntity<>(uploadedPhoto, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Upload profile photo file
     */
    @PostMapping(value = "/upload/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PhotoDTO> uploadProfilePhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") @Positive(message = "User ID must be positive") Long userId,
            @RequestParam(value = "description", required = false) String description) {
        try {
            PhotoDTO uploadedPhoto = photoService.uploadPhoto(file, userId, description, true);
            return new ResponseEntity<>(uploadedPhoto, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
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

    /**
     * Get active photos for a user (only approved photos)
     */
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<PhotoDTO>> getActivePhotosByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<PhotoDTO> photos = photoService.getActivePhotosByUser(userId);
        return ResponseEntity.ok(photos);
    }

    /**
     * Set a photo as profile photo
     */
    @PutMapping("/{photoId}/profile")
    public ResponseEntity<PhotoDTO> setAsProfilePhoto(
            @PathVariable @Positive(message = "Photo ID must be positive") Long photoId,
            @RequestParam("userId") @Positive(message = "User ID must be positive") Long userId) {
        try {
            PhotoDTO profilePhoto = photoService.setAsProfilePhoto(photoId, userId);
            return ResponseEntity.ok(profilePhoto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
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