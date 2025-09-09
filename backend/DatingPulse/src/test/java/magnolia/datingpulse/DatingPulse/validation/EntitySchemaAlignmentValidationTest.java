package magnolia.datingpulse.DatingPulse.validation;

import magnolia.datingpulse.DatingPulse.entity.*;
import org.junit.jupiter.api.Test;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.lang.reflect.Field;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Test to validate that entities properly map to database schema
 * after migrations V14 and V15 are applied.
 */
public class EntitySchemaAlignmentValidationTest {

    @Test
    public void testPreferenceEntityMappings() throws NoSuchFieldException {
        // Test that key preference fields are no longer @Transient and have @Column mappings
        Class<Preference> preferenceClass = Preference.class;
        
        // Test smoking field mapping
        Field smokingField = preferenceClass.getDeclaredField("smoking");
        Column smokingColumn = smokingField.getAnnotation(Column.class);
        assertNotNull(smokingColumn, "smoking field should have @Column annotation");
        assertEquals("smoking", smokingColumn.name(), "smoking field should map to smoking column");
        
        // Test drinking field mapping  
        Field drinkingField = preferenceClass.getDeclaredField("drinking");
        Column drinkingColumn = drinkingField.getAnnotation(Column.class);
        assertNotNull(drinkingColumn, "drinking field should have @Column annotation");
        assertEquals("drinking", drinkingColumn.name(), "drinking field should map to drinking column");
        
        // Test exercisePreference field mapping
        Field exerciseField = preferenceClass.getDeclaredField("exercisePreference");
        Column exerciseColumn = exerciseField.getAnnotation(Column.class);
        assertNotNull(exerciseColumn, "exercisePreference field should have @Column annotation");
        assertEquals("exercise_preference", exerciseColumn.name(), "exercisePreference field should map to exercise_preference column");
        
        // Test hobbies field mapping
        Field hobbiesField = preferenceClass.getDeclaredField("hobbies");
        Column hobbiesColumn = hobbiesField.getAnnotation(Column.class);
        assertNotNull(hobbiesColumn, "hobbies field should have @Column annotation");
        assertEquals("hobbies", hobbiesColumn.name(), "hobbies field should map to hobbies column");
    }

    @Test
    public void testPhotoEntityMappings() throws NoSuchFieldException {
        Class<Photo> photoClass = Photo.class;
        
        // Test description field exists
        Field descriptionField = photoClass.getDeclaredField("description");
        Column descriptionColumn = descriptionField.getAnnotation(Column.class);
        assertNotNull(descriptionColumn, "description field should have @Column annotation");
        assertEquals("description", descriptionColumn.name(), "description field should map to description column");
        
        // Test updatedAt field exists
        Field updatedAtField = photoClass.getDeclaredField("updatedAt");
        Column updatedAtColumn = updatedAtField.getAnnotation(Column.class);
        assertNotNull(updatedAtColumn, "updatedAt field should have @Column annotation");
        assertEquals("updated_at", updatedAtColumn.name(), "updatedAt field should map to updated_at column");
    }

    @Test
    public void testUserEntityMappings() throws NoSuchFieldException {
        Class<User> userClass = User.class;
        
        // Test isVerified field exists and is mapped correctly
        Field isVerifiedField = userClass.getDeclaredField("isVerified");
        Column isVerifiedColumn = isVerifiedField.getAnnotation(Column.class);
        assertNotNull(isVerifiedColumn, "isVerified field should have @Column annotation");
        assertEquals("is_verified", isVerifiedColumn.name(), "isVerified field should map to is_verified column");
    }

    @Test
    public void testSessionEntityMappings() throws NoSuchFieldException {
        Class<Session> sessionClass = Session.class;
        
        // Test deviceInfo field exists and is mapped correctly
        Field deviceInfoField = sessionClass.getDeclaredField("deviceInfo");
        Column deviceInfoColumn = deviceInfoField.getAnnotation(Column.class);
        assertNotNull(deviceInfoColumn, "deviceInfo field should have @Column annotation");
        assertEquals("device_info", deviceInfoColumn.name(), "deviceInfo field should map to device_info column");
        
        // Test revokedAt field exists and is mapped correctly
        Field revokedAtField = sessionClass.getDeclaredField("revokedAt");
        Column revokedAtColumn = revokedAtField.getAnnotation(Column.class);
        assertNotNull(revokedAtColumn, "revokedAt field should have @Column annotation");
        assertEquals("revoked_at", revokedAtColumn.name(), "revokedAt field should map to revoked_at column");
    }

    @Test
    public void testMessageEntityMappings() throws NoSuchFieldException {
        Class<Message> messageClass = Message.class;
        
        // Test status field exists and is mapped correctly
        Field statusField = messageClass.getDeclaredField("status");
        Column statusColumn = statusField.getAnnotation(Column.class);
        assertNotNull(statusColumn, "status field should have @Column annotation");
        assertEquals("status", statusColumn.name(), "status field should map to status column");
    }

    @Test
    public void testNotificationEntityMappings() throws NoSuchFieldException {
        Class<Notification> notificationClass = Notification.class;
        
        // Test message field exists
        Field messageField = notificationClass.getDeclaredField("message");
        Column messageColumn = messageField.getAnnotation(Column.class);
        assertNotNull(messageColumn, "message field should have @Column annotation");
        
        // Test data field exists
        Field dataField = notificationClass.getDeclaredField("data");
        Column dataColumn = dataField.getAnnotation(Column.class);
        assertNotNull(dataColumn, "data field should have @Column annotation");
        
        // Test readAt field exists
        Field readAtField = notificationClass.getDeclaredField("readAt");
        Column readAtColumn = readAtField.getAnnotation(Column.class);
        assertNotNull(readAtColumn, "readAt field should have @Column annotation");
        assertEquals("read_at", readAtColumn.name(), "readAt field should map to read_at column");
    }

    @Test
    public void testEntityTableMappings() {
        // Test that entities have correct table mappings
        Table preferenceTable = Preference.class.getAnnotation(Table.class);
        assertNotNull(preferenceTable, "Preference entity should have @Table annotation");
        assertEquals("preferences", preferenceTable.name(), "Preference entity should map to preferences table");
        
        Table photoTable = Photo.class.getAnnotation(Table.class);
        assertNotNull(photoTable, "Photo entity should have @Table annotation");
        assertEquals("photos", photoTable.name(), "Photo entity should map to photos table");
        
        Table userTable = User.class.getAnnotation(Table.class);
        assertNotNull(userTable, "User entity should have @Table annotation");
        assertEquals("users", userTable.name(), "User entity should map to users table");
        
        Table sessionTable = Session.class.getAnnotation(Table.class);
        assertNotNull(sessionTable, "Session entity should have @Table annotation");
        assertEquals("sessions", sessionTable.name(), "Session entity should map to sessions table");
        
        Table messageTable = Message.class.getAnnotation(Table.class);
        assertNotNull(messageTable, "Message entity should have @Table annotation");
        assertEquals("messages", messageTable.name(), "Message entity should map to messages table");
        
        Table notificationTable = Notification.class.getAnnotation(Table.class);
        assertNotNull(notificationTable, "Notification entity should have @Table annotation");
        assertEquals("notifications", notificationTable.name(), "Notification entity should map to notifications table");
    }
}