package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {

    @Value("${app.s3.enabled:true}")
    private boolean s3Enabled;

    @Value("${app.s3.bucket-name:datingpulse-photos}")
    private String bucketName;

    @Value("${app.s3.region:us-east-1}")
    private String region;

    @Value("${app.upload.max-file-size:5242880}") // 5MB default
    private long maxFileSize;

    @Value("${app.upload.allowed-types:jpg,jpeg,png,gif,webp}")
    private String allowedTypes;

    @Value("${app.upload.resize.max-width:1024}")
    private int maxWidth;

    @Value("${app.upload.resize.max-height:1024}")
    private int maxHeight;

    @Value("${app.upload.path:/tmp/uploads}")
    private String uploadPath;

    private final S3Client s3Client;
    
    // Constructor with optional S3Client
    @Autowired
    public FileUploadService(@Autowired(required = false) S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Upload a photo file to cloud storage with automatic resizing and optimization
     */
    public String uploadPhoto(MultipartFile file, Long userId) throws IOException {
        validateFile(file);
        
        String fileName = generateFileName(file, userId);
        BufferedImage resizedImage = resizeImage(file);
        byte[] optimizedImageData = optimizeImage(resizedImage, getFileExtension(file));
        
        return uploadFile(fileName, optimizedImageData, file.getContentType());
    }

    /**
     * Upload a profile photo with specific dimensions
     */
    public String uploadProfilePhoto(MultipartFile file, Long userId) throws IOException {
        validateFile(file);
        
        String fileName = generateProfilePhotoFileName(file, userId);
        BufferedImage resizedImage = resizeImageForProfile(file);
        byte[] optimizedImageData = optimizeImage(resizedImage, getFileExtension(file));
        
        return uploadFile(fileName, optimizedImageData, file.getContentType());
    }

    private void validateFile(MultipartFile file) throws IllegalArgumentException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + maxFileSize + " bytes");
        }

        String contentType = file.getContentType();
        if (contentType == null || !isAllowedContentType(contentType)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + allowedTypes);
        }
    }

    private boolean isAllowedContentType(String contentType) {
        List<String> allowedTypesList = Arrays.asList(allowedTypes.split(","));
        return allowedTypesList.stream()
                .anyMatch(type -> contentType.toLowerCase().contains(type.toLowerCase()));
    }

    private String generateFileName(MultipartFile file, Long userId) {
        String extension = getFileExtension(file);
        return String.format("photos/%d/%s.%s", userId, UUID.randomUUID().toString(), extension);
    }

    private String generateProfilePhotoFileName(MultipartFile file, Long userId) {
        String extension = getFileExtension(file);
        return String.format("profile-photos/%d/%s.%s", userId, UUID.randomUUID().toString(), extension);
    }

    private String getFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        }
        return "jpg"; // Default extension
    }

    private BufferedImage resizeImage(MultipartFile file) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IOException("Unable to read image file");
        }

        // Only resize if image is larger than max dimensions
        if (originalImage.getWidth() <= maxWidth && originalImage.getHeight() <= maxHeight) {
            return originalImage;
        }

        return Scalr.resize(originalImage, Scalr.Method.QUALITY, maxWidth, maxHeight);
    }

    private BufferedImage resizeImageForProfile(MultipartFile file) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IOException("Unable to read image file");
        }

        // Profile photos should be square and smaller
        int profileSize = 512;
        return Scalr.resize(originalImage, Scalr.Method.QUALITY, Scalr.Mode.FIT_TO_WIDTH, 
                           profileSize, profileSize);
    }

    private byte[] optimizeImage(BufferedImage image, String format) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        // Convert format if needed
        String outputFormat = format.equals("jpg") ? "jpeg" : format;
        
        if (!ImageIO.write(image, outputFormat, outputStream)) {
            throw new IOException("Failed to write image in format: " + outputFormat);
        }
        
        return outputStream.toByteArray();
    }

    private String uploadFile(String fileName, byte[] imageData, String contentType) throws IOException {
        if (s3Enabled && s3Client != null) {
            return uploadToS3(fileName, imageData, contentType);
        } else {
            return uploadToLocalStorage(fileName, imageData, contentType);
        }
    }

    private String uploadToS3(String fileName, byte[] imageData, String contentType) {
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(imageData));
            
            // Return the public URL
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
            
        } catch (Exception e) {
            log.error("Failed to upload file to S3: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file to cloud storage", e);
        }
    }

    private String uploadToLocalStorage(String fileName, byte[] imageData, String contentType) throws IOException {
        try {
            // Create directory structure if it doesn't exist
            Path fullPath = Paths.get(uploadPath, fileName);
            Path parentDir = fullPath.getParent();
            if (parentDir != null) {
                Files.createDirectories(parentDir);
            }
            
            // Write file to local storage
            Files.write(fullPath, imageData);
            
            // Return the local URL (relative to upload path)
            return "/uploads/" + fileName;
            
        } catch (Exception e) {
            log.error("Failed to upload file to local storage: {}", e.getMessage());
            throw new IOException("Failed to upload file to local storage", e);
        }
    }

    /**
     * Delete a photo from cloud storage
     */
    public void deletePhoto(String photoUrl) {
        try {
            String key = extractKeyFromUrl(photoUrl);
            s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", e.getMessage());
            throw new RuntimeException("Failed to delete file from cloud storage", e);
        }
    }

    private String extractKeyFromUrl(String url) {
        // Extract the key from the S3 URL
        // Format: https://bucket.s3.region.amazonaws.com/key
        String[] parts = url.split(bucketName + ".s3." + region + ".amazonaws.com/");
        if (parts.length > 1) {
            return parts[1];
        }
        throw new IllegalArgumentException("Invalid S3 URL format");
    }
}