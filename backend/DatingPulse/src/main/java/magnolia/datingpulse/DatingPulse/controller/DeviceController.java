package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.DeviceDTO;
import magnolia.datingpulse.DatingPulse.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
@Validated
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    public ResponseEntity<DeviceDTO> registerDevice(@Valid @RequestBody DeviceDTO deviceDTO) {
        try {
            DeviceDTO registeredDevice = deviceService.registerDevice(deviceDTO);
            return new ResponseEntity<>(registeredDevice, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<DeviceDTO> getDeviceById(
            @PathVariable @Positive(message = "Device ID must be positive") Long deviceId) {
        try {
            DeviceDTO device = deviceService.getDeviceById(deviceId);
            return ResponseEntity.ok(device);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DeviceDTO>> getDevicesByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<DeviceDTO> devices = deviceService.getDevicesByUser(userId);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<DeviceDTO>> getDevicesByUserAndType(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @PathVariable @NotBlank(message = "Device type cannot be blank") String type) {
        List<DeviceDTO> devices = deviceService.getDevicesByUserAndType(userId, type);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<DeviceDTO>> getDevicesByType(
            @PathVariable @NotBlank(message = "Device type cannot be blank") String type) {
        List<DeviceDTO> devices = deviceService.getDevicesByType(type);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/active")
    public ResponseEntity<List<DeviceDTO>> getActiveDevices(
            @RequestParam(defaultValue = "30") int minutesThreshold) {
        List<DeviceDTO> devices = deviceService.getActiveDevices(minutesThreshold);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<DeviceDTO>> getInactiveDevices(
            @RequestParam(defaultValue = "30") int daysThreshold) {
        List<DeviceDTO> devices = deviceService.getInactiveDevices(daysThreshold);
        return ResponseEntity.ok(devices);
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<DeviceDTO> updateDevice(
            @PathVariable @Positive(message = "Device ID must be positive") Long deviceId,
            @Valid @RequestBody DeviceDTO deviceDTO) {
        try {
            DeviceDTO updatedDevice = deviceService.updateDevice(deviceId, deviceDTO);
            return ResponseEntity.ok(updatedDevice);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{deviceId}/last-seen")
    public ResponseEntity<DeviceDTO> updateLastSeen(
            @PathVariable @Positive(message = "Device ID must be positive") Long deviceId) {
        try {
            DeviceDTO updatedDevice = deviceService.updateLastSeen(deviceId);
            return ResponseEntity.ok(updatedDevice);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{deviceId}/push-token")
    public ResponseEntity<DeviceDTO> updatePushToken(
            @PathVariable @Positive(message = "Device ID must be positive") Long deviceId,
            @RequestParam @NotBlank(message = "Push token is required") String pushToken) {
        try {
            DeviceDTO updatedDevice = deviceService.updatePushToken(deviceId, pushToken);
            return ResponseEntity.ok(updatedDevice);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteDevice(
            @PathVariable @Positive(message = "Device ID must be positive") Long deviceId) {
        try {
            deviceService.deleteDevice(deviceId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUserDevices(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            deviceService.deleteUserDevices(userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/cleanup/inactive")
    public ResponseEntity<Void> cleanupInactiveDevices(
            @RequestParam(defaultValue = "90") int daysThreshold) {
        deviceService.cleanupInactiveDevices(daysThreshold);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/has-active")
    public ResponseEntity<Boolean> hasActiveDevice(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @RequestParam(defaultValue = "30") int minutesThreshold) {
        boolean hasActive = deviceService.hasActiveDevice(userId, minutesThreshold);
        return ResponseEntity.ok(hasActive);
    }

    @GetMapping("/count/total")
    public ResponseEntity<Long> getTotalDeviceCount() {
        long count = deviceService.getTotalDeviceCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/type/{type}")
    public ResponseEntity<Long> getDeviceCountByType(
            @PathVariable @NotBlank(message = "Device type cannot be blank") String type) {
        long count = deviceService.getDeviceCountByType(type);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/active")
    public ResponseEntity<Long> getActiveDeviceCount(
            @RequestParam(defaultValue = "30") int minutesThreshold) {
        long count = deviceService.getActiveDeviceCount(minutesThreshold);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Long> getDeviceCountByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = deviceService.getDeviceCountByUser(userId);
        return ResponseEntity.ok(count);
    }
}