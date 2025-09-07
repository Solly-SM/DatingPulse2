package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.InterestDTO;
import magnolia.datingpulse.DatingPulse.entity.Interest;
import magnolia.datingpulse.DatingPulse.mapper.InterestMapper;
import magnolia.datingpulse.DatingPulse.repositories.InterestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestService {
    private final InterestRepository interestRepository;
    private final InterestMapper interestMapper;

    @Transactional
    public InterestDTO createInterest(InterestDTO interestDTO) {
        // Check if interest name already exists
        if (interestRepository.findByName(interestDTO.getName()).isPresent()) {
            throw new IllegalArgumentException("Interest already exists with name: " + interestDTO.getName());
        }

        // Validate interest name
        if (!isValidInterestName(interestDTO.getName())) {
            throw new IllegalArgumentException("Invalid interest name: " + interestDTO.getName());
        }

        Interest interest = interestMapper.toEntity(interestDTO);
        Interest saved = interestRepository.save(interest);
        return interestMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public InterestDTO getInterestById(Long id) {
        Interest interest = interestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interest not found with ID: " + id));
        return interestMapper.toDTO(interest);
    }

    @Transactional(readOnly = true)
    public InterestDTO getInterestByName(String name) {
        Interest interest = interestRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Interest not found with name: " + name));
        return interestMapper.toDTO(interest);
    }

    @Transactional(readOnly = true)
    public List<InterestDTO> getAllInterests() {
        List<Interest> interests = interestRepository.findAll();
        return interests.stream()
                .map(interestMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterestDTO> getInterestsByNameContaining(String nameFragment) {
        List<Interest> interests = interestRepository.findByNameContainingIgnoreCase(nameFragment);
        return interests.stream()
                .map(interestMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterestDTO updateInterest(Long id, InterestDTO interestDTO) {
        Interest existing = interestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interest not found with ID: " + id));

        // Check if new name conflicts with existing interest (excluding current one)
        if (interestDTO.getName() != null && !interestDTO.getName().equals(existing.getName())) {
            Optional<Interest> conflicting = interestRepository.findByName(interestDTO.getName());
            if (conflicting.isPresent() && !conflicting.get().getId().equals(id)) {
                throw new IllegalArgumentException("Interest already exists with name: " + interestDTO.getName());
            }

            // Validate new interest name
            if (!isValidInterestName(interestDTO.getName())) {
                throw new IllegalArgumentException("Invalid interest name: " + interestDTO.getName());
            }

            existing.setName(interestDTO.getName());
        }

        Interest updated = interestRepository.save(existing);
        return interestMapper.toDTO(updated);
    }

    @Transactional
    public void deleteInterest(Long id) {
        if (!interestRepository.existsById(id)) {
            throw new IllegalArgumentException("Interest not found with ID: " + id);
        }
        
        // Note: Before deleting, you might want to check if this interest is assigned to any user profiles
        // and handle that scenario appropriately (either prevent deletion or remove associations)
        interestRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean interestExists(String name) {
        return interestRepository.findByName(name).isPresent();
    }

    @Transactional(readOnly = true)
    public long getTotalInterestCount() {
        return interestRepository.count();
    }

    /**
     * Initialize default interests for the system
     */
    @Transactional
    public void initializeDefaultInterests() {
        String[] defaultInterests = {
            "Photography", "Travel", "Music", "Reading", "Cooking", "Sports", "Movies", "Art",
            "Dancing", "Hiking", "Gaming", "Fitness", "Yoga", "Writing", "Technology", "Fashion",
            "Food", "Wine", "Coffee", "Pets", "Nature", "Adventure", "Culture", "History",
            "Science", "Education", "Volunteer Work", "Business", "Entrepreneurship", "Languages",
            "Meditation", "Spirituality", "Politics", "Environment", "Health", "Beauty",
            "Interior Design", "Cars", "Motorcycles", "Cycling", "Running", "Swimming",
            "Tennis", "Football", "Basketball", "Baseball", "Soccer", "Golf", "Martial Arts"
        };

        for (String interestName : defaultInterests) {
            if (!interestExists(interestName)) {
                InterestDTO interestDTO = new InterestDTO();
                interestDTO.setName(interestName);
                createInterest(interestDTO);
            }
        }
    }

    /**
     * Validates interest name.
     * Interest names should be reasonable length and contain valid characters.
     */
    private boolean isValidInterestName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        
        // Trim the name
        name = name.trim();
        
        // Check length (between 2 and 50 characters)
        if (name.length() < 2 || name.length() > 50) {
            return false;
        }
        
        // Check for valid characters (letters, numbers, spaces, hyphens, apostrophes)
        return name.matches("^[a-zA-Z0-9\\s\\-'&]+$");
    }
}