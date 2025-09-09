package lk.ijse.gdse71.lankastay.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessDto {
    private Long id;
    private String district;
    private Double latitude;
    private Double longitude;
    private String description;
    private String address;
    private String phoneNumber;
    private String businessName;
    private String type;
    private String imageUrl;
}
