package magnolia.datingpulse.DatingPulse.mapper;

import magnolia.datingpulse.DatingPulse.dto.PhotoReportDTO;
import magnolia.datingpulse.DatingPulse.entity.PhotoReport;
import magnolia.datingpulse.DatingPulse.entity.ReportStatus;
import magnolia.datingpulse.DatingPulse.entity.ReportType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface PhotoReportMapper {

    @Mapping(source = "photo.photoID", target = "photoId")
    @Mapping(source = "reporter.userID", target = "reporterId")
    @Mapping(source = "reportType", target = "reportType", qualifiedByName = "reportTypeToString")
    @Mapping(source = "status", target = "status", qualifiedByName = "reportStatusToString")
    @Mapping(source = "reviewedBy.userID", target = "reviewedBy")
    PhotoReportDTO toDTO(PhotoReport photoReport);

    @Mapping(target = "photo", ignore = true)
    @Mapping(target = "reporter", ignore = true)
    @Mapping(target = "reviewedBy", ignore = true)
    @Mapping(source = "reportType", target = "reportType", qualifiedByName = "stringToReportType")
    @Mapping(source = "status", target = "status", qualifiedByName = "stringToReportStatus")
    PhotoReport toEntity(PhotoReportDTO photoReportDTO);

    @Named("reportTypeToString")
    static String reportTypeToString(ReportType reportType) {
        return reportType != null ? reportType.name() : null;
    }

    @Named("stringToReportType")
    static ReportType stringToReportType(String reportType) {
        return reportType != null ? ReportType.valueOf(reportType) : null;
    }

    @Named("reportStatusToString")
    static String reportStatusToString(ReportStatus reportStatus) {
        return reportStatus != null ? reportStatus.name() : null;
    }

    @Named("stringToReportStatus")
    static ReportStatus stringToReportStatus(String reportStatus) {
        return reportStatus != null ? ReportStatus.valueOf(reportStatus) : null;
    }
}