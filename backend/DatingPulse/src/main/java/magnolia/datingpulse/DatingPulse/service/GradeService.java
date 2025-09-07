package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.GradeDTO;
import magnolia.datingpulse.DatingPulse.entity.Grade;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.GradeMapper;
import magnolia.datingpulse.DatingPulse.repositories.GradeRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeService {
    private final GradeRepository gradeRepository;
    private final UserRepository userRepository;
    private final GradeMapper gradeMapper;

    @Transactional
    public GradeDTO createGrade(GradeDTO gradeDTO) {
        // Validate users exist
        User userGiven = userRepository.findById(gradeDTO.getUserGivenID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + gradeDTO.getUserGivenID()));
        
        User userReceived = userRepository.findById(gradeDTO.getUserReceivedID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + gradeDTO.getUserReceivedID()));

        // Validate grade data
        validateGradeData(gradeDTO);

        // Check if user is trying to grade themselves
        if (gradeDTO.getUserGivenID().equals(gradeDTO.getUserReceivedID())) {
            throw new IllegalArgumentException("Users cannot grade themselves");
        }

        // Check if grade already exists between these users
        Optional<Grade> existingGrade = gradeRepository.findByUserGivenAndUserReceived(userGiven, userReceived);
        if (existingGrade.isPresent()) {
            throw new IllegalArgumentException("Grade already exists between these users");
        }

        // Map DTO to entity
        Grade grade = gradeMapper.toEntity(gradeDTO);
        grade.setUserGiven(userGiven);
        grade.setUserReceived(userReceived);

        Grade saved = gradeRepository.save(grade);
        return gradeMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public GradeDTO getGradeById(Long gradeId) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new IllegalArgumentException("Grade not found with ID: " + gradeId));
        return gradeMapper.toDTO(grade);
    }

    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesGivenByUser(Long userGivenId) {
        User userGiven = userRepository.findById(userGivenId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userGivenId));
        
        List<Grade> grades = gradeRepository.findByUserGiven(userGiven);
        return grades.stream()
                .map(gradeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesReceivedByUser(Long userReceivedId) {
        User userReceived = userRepository.findById(userReceivedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userReceivedId));
        
        List<Grade> grades = gradeRepository.findByUserReceived(userReceived);
        return grades.stream()
                .map(gradeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<GradeDTO> getGradeBetweenUsers(Long userGivenId, Long userReceivedId) {
        User userGiven = userRepository.findById(userGivenId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userGivenId));
        
        User userReceived = userRepository.findById(userReceivedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userReceivedId));
        
        Optional<Grade> grade = gradeRepository.findByUserGivenAndUserReceived(userGiven, userReceived);
        return grade.map(gradeMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByValue(Integer gradeValue) {
        if (!isValidGradeValue(gradeValue)) {
            throw new IllegalArgumentException("Invalid grade value: " + gradeValue);
        }
        
        List<Grade> grades = gradeRepository.findByGrade(gradeValue);
        return grades.stream()
                .map(gradeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeDTO> getAllGrades() {
        List<Grade> grades = gradeRepository.findAll();
        return grades.stream()
                .map(gradeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GradeDTO updateGrade(Long gradeId, GradeDTO gradeDTO) {
        Grade existing = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new IllegalArgumentException("Grade not found with ID: " + gradeId));

        // Validate grade value if being updated
        if (gradeDTO.getGrade() != null) {
            if (!isValidGradeValue(gradeDTO.getGrade())) {
                throw new IllegalArgumentException("Invalid grade value: " + gradeDTO.getGrade());
            }
            existing.setGrade(gradeDTO.getGrade());
        }

        Grade updated = gradeRepository.save(existing);
        return gradeMapper.toDTO(updated);
    }

    @Transactional
    public GradeDTO updateOrCreateGrade(Long userGivenId, Long userReceivedId, Integer gradeValue) {
        // Validate users exist
        User userGiven = userRepository.findById(userGivenId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userGivenId));
        
        User userReceived = userRepository.findById(userReceivedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userReceivedId));

        // Validate grade value
        if (!isValidGradeValue(gradeValue)) {
            throw new IllegalArgumentException("Invalid grade value: " + gradeValue);
        }

        // Check if user is trying to grade themselves
        if (userGivenId.equals(userReceivedId)) {
            throw new IllegalArgumentException("Users cannot grade themselves");
        }

        // Check if grade already exists
        Optional<Grade> existingGrade = gradeRepository.findByUserGivenAndUserReceived(userGiven, userReceived);
        
        if (existingGrade.isPresent()) {
            // Update existing grade
            Grade grade = existingGrade.get();
            grade.setGrade(gradeValue);
            Grade updated = gradeRepository.save(grade);
            return gradeMapper.toDTO(updated);
        } else {
            // Create new grade
            Grade grade = Grade.builder()
                    .userGiven(userGiven)
                    .userReceived(userReceived)
                    .grade(gradeValue)
                    .build();
            Grade saved = gradeRepository.save(grade);
            return gradeMapper.toDTO(saved);
        }
    }

    @Transactional
    public void deleteGrade(Long gradeId) {
        if (!gradeRepository.existsById(gradeId)) {
            throw new IllegalArgumentException("Grade not found with ID: " + gradeId);
        }
        gradeRepository.deleteById(gradeId);
    }

    @Transactional
    public void deleteGradeBetweenUsers(Long userGivenId, Long userReceivedId) {
        User userGiven = userRepository.findById(userGivenId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userGivenId));
        
        User userReceived = userRepository.findById(userReceivedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userReceivedId));
        
        Optional<Grade> grade = gradeRepository.findByUserGivenAndUserReceived(userGiven, userReceived);
        if (grade.isPresent()) {
            gradeRepository.delete(grade.get());
        } else {
            throw new IllegalArgumentException("No grade found between these users");
        }
    }

    @Transactional(readOnly = true)
    public Double getAverageGradeForUser(Long userReceivedId) {
        User userReceived = userRepository.findById(userReceivedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userReceivedId));
        
        List<Grade> grades = gradeRepository.findByUserReceived(userReceived);
        
        if (grades.isEmpty()) {
            return null; // No grades yet
        }
        
        double sum = grades.stream()
                .mapToInt(Grade::getGrade)
                .sum();
        
        return sum / grades.size();
    }

    @Transactional(readOnly = true)
    public long getTotalGradeCount() {
        return gradeRepository.count();
    }

    @Transactional(readOnly = true)
    public long getGradeCountForUser(Long userReceivedId) {
        User userReceived = userRepository.findById(userReceivedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userReceivedId));
        
        return gradeRepository.countByUserReceived(userReceived);
    }

    @Transactional(readOnly = true)
    public long getGradeCountByValue(Integer gradeValue) {
        if (!isValidGradeValue(gradeValue)) {
            throw new IllegalArgumentException("Invalid grade value: " + gradeValue);
        }
        
        return gradeRepository.countByGrade(gradeValue);
    }

    @Transactional(readOnly = true)
    public boolean hasUserGradedUser(Long userGivenId, Long userReceivedId) {
        User userGiven = userRepository.findById(userGivenId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userGivenId));
        
        User userReceived = userRepository.findById(userReceivedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userReceivedId));
        
        return gradeRepository.findByUserGivenAndUserReceived(userGiven, userReceived).isPresent();
    }

    @Transactional(readOnly = true)
    public List<GradeDTO> getTopRatedUsers(int limit) {
        List<Grade> grades = gradeRepository.findTopUsersByAverageGrade(limit);
        return grades.stream()
                .map(gradeMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Validates grade data
     */
    private void validateGradeData(GradeDTO gradeDTO) {
        if (gradeDTO.getUserGivenID() == null) {
            throw new IllegalArgumentException("User given ID is required");
        }
        
        if (gradeDTO.getUserReceivedID() == null) {
            throw new IllegalArgumentException("User received ID is required");
        }
        
        if (gradeDTO.getGrade() == null) {
            throw new IllegalArgumentException("Grade value is required");
        }
        
        if (!isValidGradeValue(gradeDTO.getGrade())) {
            throw new IllegalArgumentException("Grade value must be between 1 and 5");
        }
    }

    /**
     * Validates grade value (assuming 1-5 star system)
     */
    private boolean isValidGradeValue(Integer grade) {
        return grade != null && grade >= 1 && grade <= 5;
    }
}