package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.entity.Report;
import magnolia.datingpulse.DatingPulse.dto.ReportDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ReportMapper {
    @Mapping(source = "reporter.userID", target = "reporterID")
    @Mapping(source = "reported.userID", target = "reportedID")
    @Mapping(source = "reviewedBy.adminID", target = "reviewedByID")
    ReportDTO toDTO(Report entity);

    // For DTO→entity: set reporter, reported, reviewedBy in service
    Report toEntity(ReportDTO dto);
}