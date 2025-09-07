package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Grade;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByUserGiven(User userGiven);
    List<Grade> findByUserReceived(User userReceived);
    Optional<Grade> findByUserGivenAndUserReceived(User userGiven, User userReceived);
    List<Grade> findByGrade(Integer grade);
    long countByUserReceived(User userReceived);
    long countByGrade(Integer grade);
    
    @Query("SELECT g FROM Grade g WHERE g.userReceived IN " +
           "(SELECT g2.userReceived FROM Grade g2 " +
           "GROUP BY g2.userReceived " +
           "ORDER BY AVG(g2.grade) DESC " +
           "LIMIT :limit)")
    List<Grade> findTopUsersByAverageGrade(@Param("limit") int limit);
}

