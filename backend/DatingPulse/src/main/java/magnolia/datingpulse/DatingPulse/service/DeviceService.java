package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.DeviceDTO;
import magnolia.datingpulse.DatingPulse.entity.Device;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.DeviceMapper;
import magnolia.datingpulse.DatingPulse.repositories.DeviceRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final DeviceMapper deviceMapper;

    @Transactional
    public DeviceDTO registerDevice(DeviceDTO deviceDTO) {
        // Validate user exists
        User user = userRepository.findById(deviceDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + deviceDTO.getUserID()));

        // Validate device data
        validateDeviceData(deviceDTO);

        // Check if device already exists for this user and type
        Optional<Device> existingDevice = deviceRepository.findByUserAndTypeAndDeviceInfo(
                user, deviceDTO.getType(), deviceDTO.getDeviceInfo());
        
        if (existingDevice.isPresent()) {
            // Update existing device instead of creating new one
            return updateExistingDevice(existingDevice.get(), deviceDTO);
        }

        // Map DTO to entity
        Device device = deviceMapper.toEntity(deviceDTO);
        device.setUser(user);
        device.setCreatedAt(LocalDateTime.now());
        device.setLastSeen(LocalDateTime.now());

        Device saved = deviceRepository.save(device);
        return deviceMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public DeviceDTO getDeviceById(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found with ID: " + deviceId));
        return deviceMapper.toDTO(device);
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> getDevicesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<Device> devices = deviceRepository.findByUser(user);
        return devices.stream()
                .map(deviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> getDevicesByUserAndType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        if (!isValidDeviceType(type)) {
            throw new IllegalArgumentException("Invalid device type: " + type);
        }
        
        List<Device> devices = deviceRepository.findByUserAndType(user, type);
        return devices.stream()
                .map(deviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> getDevicesByType(String type) {
        if (!isValidDeviceType(type)) {
            throw new IllegalArgumentException("Invalid device type: " + type);
        }
        
        List<Device> devices = deviceRepository.findByType(type);
        return devices.stream()
                .map(deviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> getActiveDevices(int minutesThreshold) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutesThreshold);
        List<Device> devices = deviceRepository.findByLastSeenAfter(cutoffTime);
        return devices.stream()
                .map(deviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> getInactiveDevices(int daysThreshold) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(daysThreshold);
        List<Device> devices = deviceRepository.findByLastSeenBefore(cutoffTime);
        return devices.stream()
                .map(deviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeviceDTO updateDevice(Long deviceId, DeviceDTO deviceDTO) {
        Device existing = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found with ID: " + deviceId));

        // Validate updates
        validateDeviceData(deviceDTO);

        // Update fields if provided
        if (deviceDTO.getType() != null) {
            existing.setType(deviceDTO.getType());
        }
        if (deviceDTO.getPushToken() != null) {
            existing.setPushToken(deviceDTO.getPushToken());
        }
        if (deviceDTO.getDeviceInfo() != null) {
            existing.setDeviceInfo(deviceDTO.getDeviceInfo());
        }

        Device updated = deviceRepository.save(existing);
        return deviceMapper.toDTO(updated);
    }

    @Transactional
    public DeviceDTO updateLastSeen(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found with ID: " + deviceId));

        device.setLastSeen(LocalDateTime.now());
        Device updated = deviceRepository.save(device);
        return deviceMapper.toDTO(updated);
    }

    @Transactional
    public DeviceDTO updatePushToken(Long deviceId, String pushToken) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found with ID: " + deviceId));

        // Validate push token format (basic validation)
        if (pushToken != null && !isValidPushToken(pushToken)) {
            throw new IllegalArgumentException("Invalid push token format");
        }

        device.setPushToken(pushToken);
        device.setLastSeen(LocalDateTime.now());
        Device updated = deviceRepository.save(device);
        return deviceMapper.toDTO(updated);
    }

    @Transactional
    public void deleteDevice(Long deviceId) {
        if (!deviceRepository.existsById(deviceId)) {
            throw new IllegalArgumentException("Device not found with ID: " + deviceId);
        }
        deviceRepository.deleteById(deviceId);
    }

    @Transactional
    public void deleteUserDevices(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<Device> userDevices = deviceRepository.findByUser(user);
        deviceRepository.deleteAll(userDevices);
    }

    @Transactional
    public void cleanupInactiveDevices(int daysThreshold) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(daysThreshold);
        List<Device> inactiveDevices = deviceRepository.findByLastSeenBefore(cutoffTime);
        deviceRepository.deleteAll(inactiveDevices);
    }

    @Transactional(readOnly = true)
    public boolean hasActiveDevice(Long userId, int minutesThreshold) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutesThreshold);
        return deviceRepository.existsByUserAndLastSeenAfter(user, cutoffTime);
    }

    @Transactional(readOnly = true)
    public long getTotalDeviceCount() {
        return deviceRepository.count();
    }

    @Transactional(readOnly = true)
    public long getDeviceCountByType(String type) {
        if (!isValidDeviceType(type)) {
            throw new IllegalArgumentException("Invalid device type: " + type);
        }
        
        return deviceRepository.countByType(type);
    }

    @Transactional(readOnly = true)
    public long getActiveDeviceCount(int minutesThreshold) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutesThreshold);
        return deviceRepository.countByLastSeenAfter(cutoffTime);
    }

    @Transactional(readOnly = true)
    public long getDeviceCountByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return deviceRepository.countByUser(user);
    }

    /**
     * Updates an existing device instead of creating a duplicate
     */
    private DeviceDTO updateExistingDevice(Device existingDevice, DeviceDTO deviceDTO) {
        // Update push token if provided
        if (deviceDTO.getPushToken() != null) {
            existingDevice.setPushToken(deviceDTO.getPushToken());
        }
        
        // Update last seen
        existingDevice.setLastSeen(LocalDateTime.now());
        
        Device updated = deviceRepository.save(existingDevice);
        return deviceMapper.toDTO(updated);
    }

    /**
     * Validates device data
     */
    private void validateDeviceData(DeviceDTO deviceDTO) {
        if (deviceDTO.getType() == null || deviceDTO.getType().trim().isEmpty()) {
            throw new IllegalArgumentException("Device type is required");
        }

        if (!isValidDeviceType(deviceDTO.getType())) {
            throw new IllegalArgumentException("Invalid device type: " + deviceDTO.getType());
        }

        // Validate push token format if provided
        if (deviceDTO.getPushToken() != null && !isValidPushToken(deviceDTO.getPushToken())) {
            throw new IllegalArgumentException("Invalid push token format");
        }

        // Validate device info length if provided
        if (deviceDTO.getDeviceInfo() != null && deviceDTO.getDeviceInfo().length() > 1000) {
            throw new IllegalArgumentException("Device info cannot exceed 1000 characters");
        }
    }

    /**
     * Validates device type
     */
    private boolean isValidDeviceType(String type) {
        if (type == null) return false;
        String[] validTypes = {"web", "android", "ios", "desktop"};
        for (String validType : validTypes) {
            if (validType.equalsIgnoreCase(type)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Basic push token validation
     */
    private boolean isValidPushToken(String pushToken) {
        // Basic validation - push tokens are usually alphanumeric strings
        // This is a simplified validation - in real apps you'd validate based on the push service
        return pushToken.matches("^[a-zA-Z0-9:_-]+$") && pushToken.length() > 10;
    }
}