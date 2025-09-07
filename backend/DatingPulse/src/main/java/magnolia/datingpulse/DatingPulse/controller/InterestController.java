package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.InterestDTO;
import magnolia.datingpulse.DatingPulse.service.InterestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interests")
@RequiredArgsConstructor
@Validated
public class InterestController {

    private final InterestService interestService;

    @PostMapping
    public ResponseEntity<InterestDTO> createInterest(@Valid @RequestBody InterestDTO interestDTO) {
        try {
            InterestDTO createdInterest = interestService.createInterest(interestDTO);
            return new ResponseEntity<>(createdInterest, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterestDTO> getInterestById(
            @PathVariable @Positive(message = "Interest ID must be positive") Long id) {
        try {
            InterestDTO interest = interestService.getInterestById(id);
            return ResponseEntity.ok(interest);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<InterestDTO> getInterestByName(
            @PathVariable @NotBlank(message = "Interest name cannot be blank") String name) {
        try {
            InterestDTO interest = interestService.getInterestByName(name);
            return ResponseEntity.ok(interest);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<InterestDTO>> getAllInterests() {
        List<InterestDTO> interests = interestService.getAllInterests();
        return ResponseEntity.ok(interests);
    }

    @GetMapping("/search")
    public ResponseEntity<List<InterestDTO>> searchInterests(
            @RequestParam @NotBlank(message = "Search term cannot be blank") String nameFragment) {
        List<InterestDTO> interests = interestService.getInterestsByNameContaining(nameFragment);
        return ResponseEntity.ok(interests);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterestDTO> updateInterest(
            @PathVariable @Positive(message = "Interest ID must be positive") Long id,
            @Valid @RequestBody InterestDTO interestDTO) {
        try {
            InterestDTO updatedInterest = interestService.updateInterest(id, interestDTO);
            return ResponseEntity.ok(updatedInterest);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterest(
            @PathVariable @Positive(message = "Interest ID must be positive") Long id) {
        try {
            interestService.deleteInterest(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> interestExists(
            @PathVariable @NotBlank(message = "Interest name cannot be blank") String name) {
        boolean exists = interestService.interestExists(name);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalInterestCount() {
        long count = interestService.getTotalInterestCount();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/initialize-defaults")
    public ResponseEntity<Void> initializeDefaultInterests() {
        interestService.initializeDefaultInterests();
        return ResponseEntity.ok().build();
    }
}