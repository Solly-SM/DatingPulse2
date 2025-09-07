package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.GradeDTO;
import magnolia.datingpulse.DatingPulse.service.GradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
@Validated
public class GradeController {

    private final GradeService gradeService;

    @PostMapping
    public ResponseEntity<GradeDTO> createGrade(@Valid @RequestBody GradeDTO gradeDTO) {
        try {
            GradeDTO createdGrade = gradeService.createGrade(gradeDTO);
            return new ResponseEntity<>(createdGrade, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{gradeId}")
    public ResponseEntity<GradeDTO> getGradeById(
            @PathVariable @Positive(message = "Grade ID must be positive") Long gradeId) {
        try {
            GradeDTO grade = gradeService.getGradeById(gradeId);
            return ResponseEntity.ok(grade);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/given-by/{userGivenId}")
    public ResponseEntity<List<GradeDTO>> getGradesGivenByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userGivenId) {
        List<GradeDTO> grades = gradeService.getGradesGivenByUser(userGivenId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/received-by/{userReceivedId}")
    public ResponseEntity<List<GradeDTO>> getGradesReceivedByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userReceivedId) {
        List<GradeDTO> grades = gradeService.getGradesReceivedByUser(userReceivedId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/between-users")
    public ResponseEntity<GradeDTO> getGradeBetweenUsers(
            @RequestParam @NotNull @Positive(message = "User given ID must be positive") Long userGivenId,
            @RequestParam @NotNull @Positive(message = "User received ID must be positive") Long userReceivedId) {
        Optional<GradeDTO> grade = gradeService.getGradeBetweenUsers(userGivenId, userReceivedId);
        return grade.map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-value/{gradeValue}")
    public ResponseEntity<List<GradeDTO>> getGradesByValue(
            @PathVariable @Min(value = 1, message = "Grade value must be at least 1") 
            @Max(value = 5, message = "Grade value must not exceed 5") Integer gradeValue) {
        List<GradeDTO> grades = gradeService.getGradesByValue(gradeValue);
        return ResponseEntity.ok(grades);
    }

    @GetMapping
    public ResponseEntity<List<GradeDTO>> getAllGrades() {
        List<GradeDTO> grades = gradeService.getAllGrades();
        return ResponseEntity.ok(grades);
    }

    @PutMapping("/{gradeId}")
    public ResponseEntity<GradeDTO> updateGrade(
            @PathVariable @Positive(message = "Grade ID must be positive") Long gradeId,
            @Valid @RequestBody GradeDTO gradeDTO) {
        try {
            GradeDTO updatedGrade = gradeService.updateGrade(gradeId, gradeDTO);
            return ResponseEntity.ok(updatedGrade);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update-or-create")
    public ResponseEntity<GradeDTO> updateOrCreateGrade(
            @RequestParam @NotNull @Positive(message = "User given ID must be positive") Long userGivenId,
            @RequestParam @NotNull @Positive(message = "User received ID must be positive") Long userReceivedId,
            @RequestParam @NotNull @Min(value = 1, message = "Grade value must be at least 1") 
            @Max(value = 5, message = "Grade value must not exceed 5") Integer gradeValue) {
        try {
            GradeDTO grade = gradeService.updateOrCreateGrade(userGivenId, userReceivedId, gradeValue);
            return ResponseEntity.ok(grade);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{gradeId}")
    public ResponseEntity<Void> deleteGrade(
            @PathVariable @Positive(message = "Grade ID must be positive") Long gradeId) {
        try {
            gradeService.deleteGrade(gradeId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/between-users")
    public ResponseEntity<Void> deleteGradeBetweenUsers(
            @RequestParam @NotNull @Positive(message = "User given ID must be positive") Long userGivenId,
            @RequestParam @NotNull @Positive(message = "User received ID must be positive") Long userReceivedId) {
        try {
            gradeService.deleteGradeBetweenUsers(userGivenId, userReceivedId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/average/{userReceivedId}")
    public ResponseEntity<Double> getAverageGradeForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userReceivedId) {
        Double averageGrade = gradeService.getAverageGradeForUser(userReceivedId);
        return ResponseEntity.ok(averageGrade);
    }

    @GetMapping("/count/total")
    public ResponseEntity<Long> getTotalGradeCount() {
        long count = gradeService.getTotalGradeCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/user/{userReceivedId}")
    public ResponseEntity<Long> getGradeCountForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userReceivedId) {
        long count = gradeService.getGradeCountForUser(userReceivedId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/by-value/{gradeValue}")
    public ResponseEntity<Long> getGradeCountByValue(
            @PathVariable @Min(value = 1, message = "Grade value must be at least 1") 
            @Max(value = 5, message = "Grade value must not exceed 5") Integer gradeValue) {
        long count = gradeService.getGradeCountByValue(gradeValue);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/has-graded")
    public ResponseEntity<Boolean> hasUserGradedUser(
            @RequestParam @NotNull @Positive(message = "User given ID must be positive") Long userGivenId,
            @RequestParam @NotNull @Positive(message = "User received ID must be positive") Long userReceivedId) {
        boolean hasGraded = gradeService.hasUserGradedUser(userGivenId, userReceivedId);
        return ResponseEntity.ok(hasGraded);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<GradeDTO>> getTopRatedUsers(
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "Limit must be at least 1") 
            @Max(value = 100, message = "Limit must not exceed 100") int limit) {
        List<GradeDTO> topRatedUsers = gradeService.getTopRatedUsers(limit);
        return ResponseEntity.ok(topRatedUsers);
    }
}