package magnolia.datingpulse.DatingPulse.entity;

import jakarta.persistence.*;
import org.junit.jupiter.api.Test;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test to verify the Match entity column mapping fix
 */
class MatchColumnMappingTest {

    @Test
    void testMatchSourceColumnMapping() throws NoSuchFieldException {
        // Get the matchSource field
        Field matchSourceField = Match.class.getDeclaredField("matchSource");
        
        // Check if @Column annotation exists
        Column columnAnnotation = matchSourceField.getAnnotation(Column.class);
        assertNotNull(columnAnnotation, "matchSource field should have @Column annotation");
        
        // Check if the column name is correct
        assertEquals("match_source", columnAnnotation.name(), 
                "Column name should be 'match_source' to match database schema");
    }
    
    @Test
    void testMatchEntityTableMapping() {
        // Check if the entity has correct table mapping
        Table tableAnnotation = Match.class.getAnnotation(Table.class);
        assertNotNull(tableAnnotation, "Match entity should have @Table annotation");
        assertEquals("matches", tableAnnotation.name(), "Table name should be 'matches'");
    }
    
    @Test
    void testMatchSourceFieldExists() throws NoSuchFieldException {
        // Ensure the matchSource field exists and has correct type
        Field matchSourceField = Match.class.getDeclaredField("matchSource");
        assertEquals(String.class, matchSourceField.getType(), 
                "matchSource field should be of type String");
    }
}