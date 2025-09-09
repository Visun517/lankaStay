package lk.ijse.gdse71.lankastay.dto;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class BusinessDto {
    private String district;
    private Double latitude;
    private Double longitude;
    private String description;
    private String address;
    private String phoneNumber;
    private String businessName;
    private String type;
}
