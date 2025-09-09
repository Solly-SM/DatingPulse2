// Simple validation test for V8 migration
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class test_migration_v8 {
    public static void main(String[] args) {
        try {
            String migrationPath = "/home/runner/work/DatingPulse/DatingPulse/backend/DatingPulse/src/main/resources/db/migration/V8__Add_missing_notification_content_column.sql";
            String content = Files.readString(Paths.get(migrationPath));
            
            System.out.println("Migration V8 Content:");
            System.out.println("===================");
            System.out.println(content);
            
            // Basic syntax validation
            System.out.println("\nValidation Results:");
            System.out.println("==================");
            
            boolean hasAlterTable = content.contains("ALTER TABLE notifications");
            boolean hasAddColumn = content.contains("ADD COLUMN content TEXT");
            boolean hasUpdate = content.contains("UPDATE notifications SET content = message");
            boolean hasNotNull = content.contains("ALTER COLUMN content SET NOT NULL");
            
            System.out.println("✓ Contains ALTER TABLE: " + hasAlterTable);
            System.out.println("✓ Contains ADD COLUMN: " + hasAddColumn);
            System.out.println("✓ Contains UPDATE statement: " + hasUpdate);
            System.out.println("✓ Contains NOT NULL constraint: " + hasNotNull);
            
            boolean isValid = hasAlterTable && hasAddColumn && hasUpdate && hasNotNull;
            System.out.println("\n" + (isValid ? "✅ Migration syntax looks valid!" : "❌ Migration has issues!"));
            
        } catch (IOException e) {
            System.err.println("Error reading migration file: " + e.getMessage());
        }
    }
}