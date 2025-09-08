# Photo/Media Management Implementation Guide

## Overview
This document describes the comprehensive photo and media management system implemented for DatingPulse, including cloud storage integration, automatic content moderation, and user reporting features.

## Features Implemented

### 1. File Upload System
- **Multi-part file upload** with automatic validation
- **Image resizing and optimization** using Scalr library
- **AWS S3 cloud storage** integration with configurable settings
- **Profile photo management** with specific dimensions (512x512 square)
- **File type validation** (jpg, jpeg, png, gif, webp)
- **File size limits** (configurable, default 5MB)

### 2. Content Moderation
- **Automatic content filtering** using keyword detection
- **Photo approval workflow** for administrators
- **Bulk operations** for efficient moderation
- **Configurable blocked keywords** via properties
- **Status tracking** (PENDING, ACTIVE, REJECTED, FLAGGED, REMOVED)

### 3. Reporting System
- **User reporting** for inappropriate content
- **Report type classification** (INAPPROPRIATE_CONTENT, NUDITY, SPAM, etc.)
- **Admin review workflow** with resolution tracking
- **Duplicate prevention** (users can't report same photo twice)

## Configuration

### Application Properties
```properties
# Photo Upload and Storage Configuration
app.s3.bucket-name=${S3_BUCKET_NAME:datingpulse-photos}
app.s3.region=${S3_REGION:us-east-1}
app.upload.max-file-size=5242880
app.upload.allowed-types=jpg,jpeg,png,gif,webp
app.upload.resize.max-width=1024
app.upload.resize.max-height=1024

# Content Moderation Configuration
app.moderation.auto-approve=${AUTO_APPROVE_PHOTOS:false}
app.moderation.blocked-keywords=nude,explicit,inappropriate,nsfw,adult,sex,porn
```

### AWS S3 Setup
1. Create an S3 bucket for photo storage
2. Configure IAM user with S3 permissions
3. Set AWS credentials via environment variables or AWS credentials file
4. Update bucket name and region in application properties

## API Endpoints

### Photo Upload Endpoints

#### Upload Photo File
```http
POST /api/photos/upload
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (required)
- userId: Long (required)
- description: String (optional)
- isProfilePhoto: Boolean (default: false)
```

#### Upload Profile Photo
```http
POST /api/photos/upload/profile
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (required)
- userId: Long (required)
- description: String (optional)
```

#### Set Photo as Profile
```http
PUT /api/photos/{photoId}/profile?userId={userId}
```

#### Get Active Photos
```http
GET /api/photos/user/{userId}/active
```

### Moderation Endpoints (Admin Only)

#### Get Pending Photos
```http
GET /api/moderation/pending
Authorization: Bearer {admin_token}
```

#### Get Flagged Photos
```http
GET /api/moderation/flagged
Authorization: Bearer {admin_token}
```

#### Approve Photo
```http
PUT /api/moderation/photos/{photoId}/approve
Authorization: Bearer {admin_token}
```

#### Reject Photo
```http
PUT /api/moderation/photos/{photoId}/reject?reason={reason}
Authorization: Bearer {admin_token}
```

#### Bulk Operations
```http
PUT /api/moderation/photos/approve-bulk
Content-Type: application/json
Authorization: Bearer {admin_token}

Body: [1, 2, 3, 4, 5]
```

### Reporting Endpoints

#### Report Photo
```http
POST /api/reports
Content-Type: application/json

Body:
{
  "photoId": 1,
  "reporterId": 2,
  "reportType": "INAPPROPRIATE_CONTENT",
  "additionalDetails": "This photo contains inappropriate content"
}
```

#### Get Pending Reports (Admin)
```http
GET /api/reports/pending
Authorization: Bearer {admin_token}
```

#### Resolve Report (Admin)
```http
PUT /api/reports/{reportId}/resolve?reviewerId={reviewerId}&notes={notes}
Authorization: Bearer {admin_token}
```

## Database Schema

### Photo Status Enhancement
```sql
-- PhotoStatus enum now includes:
-- PENDING, ACTIVE, REJECTED, FLAGGED, REMOVED
```

### New PhotoReport Table
```sql
CREATE TABLE photo_reports (
    report_id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL REFERENCES photos(photoID),
    reporter_id BIGINT NOT NULL REFERENCES users(userID),
    report_type VARCHAR(30) NOT NULL,
    additional_details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by BIGINT REFERENCES users(userID),
    resolution_notes VARCHAR(500),
    UNIQUE(photo_id, reporter_id)
);
```

## Usage Examples

### Upload a Photo
```javascript
const formData = new FormData();
formData.append('file', photoFile);
formData.append('userId', '123');
formData.append('description', 'Beautiful sunset');
formData.append('isProfilePhoto', 'false');

fetch('/api/photos/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(photo => console.log('Photo uploaded:', photo));
```

### Report Inappropriate Content
```javascript
fetch('/api/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userToken
  },
  body: JSON.stringify({
    photoId: 456,
    reporterId: 123,
    reportType: 'INAPPROPRIATE_CONTENT',
    additionalDetails: 'This photo violates community guidelines'
  })
})
.then(response => response.json())
.then(report => console.log('Report submitted:', report));
```

### Admin Moderation
```javascript
// Approve a photo
fetch('/api/moderation/photos/456/approve', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + adminToken
  }
})
.then(response => {
  if (response.ok) {
    console.log('Photo approved');
  }
});

// Bulk approve photos
fetch('/api/moderation/photos/approve-bulk', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + adminToken
  },
  body: JSON.stringify([1, 2, 3, 4, 5])
})
.then(response => {
  if (response.ok) {
    console.log('Photos bulk approved');
  }
});
```

## Security Considerations

### File Upload Security
- File type validation prevents executable uploads
- File size limits prevent DoS attacks
- Images are processed and re-encoded to remove metadata
- All uploads go through content moderation

### Access Control
- Moderation endpoints require ADMIN role
- Users can only modify their own photos
- Photo visibility controls prevent unauthorized access
- Report system prevents spam with duplicate detection

### Data Protection
- Photos are stored in secure S3 buckets
- URLs can be configured with expiration times
- Sensitive content is automatically flagged
- All moderation actions are logged and auditable

## Testing

### Unit Tests
- `ContentModerationServiceTest` - Tests automatic moderation logic
- `PhotoReportServiceTest` - Tests reporting workflow
- Tests cover edge cases and error handling

### Integration Testing
```bash
# Run tests
./mvnw test -Dtest=ContentModerationServiceTest,PhotoReportServiceTest
```

## Monitoring and Maintenance

### Metrics to Monitor
- Upload success/failure rates
- Content moderation queue size
- Report resolution times
- Storage usage and costs

### Maintenance Tasks
- Regular review of blocked keywords
- Cleanup of rejected/removed photos
- Audit of moderation decisions
- Update ML content filtering models (future enhancement)

## Future Enhancements

### Planned Improvements
1. **ML-based Content Detection** - Integrate AWS Rekognition or similar
2. **Video Support** - Extend to handle video uploads
3. **Advanced Image Processing** - Watermarking, filters, etc.
4. **CDN Integration** - CloudFront for faster delivery
5. **Automated Backup** - Cross-region replication
6. **Analytics Dashboard** - Real-time moderation metrics

### API Rate Limiting
Consider implementing rate limiting for upload endpoints to prevent abuse:
```properties
# Future configuration
app.upload.rate-limit.requests-per-minute=10
app.upload.rate-limit.requests-per-hour=100
```