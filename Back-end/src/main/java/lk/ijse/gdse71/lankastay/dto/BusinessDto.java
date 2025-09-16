package lk.ijse.gdse71.lankastay.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "District is required")
    private String district;
    @NotNull(message = "Latitude is required")
    private Double latitude;
    @NotNull(message = "Longitude is required")
    private Double longitude;
    @NotBlank(message = "Job description is required")
    @Size(min = 10, max = 500, message = "Job description must be between 10 and 500 characters")
    private String description;
    @NotBlank(message = "Address is required")
    private String address;
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 digits")
    private String phoneNumber;
    @NotBlank(message = "Business name is required")
    private String businessName;
    @NotBlank(message = "Business type is required")
    private String type;
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
}
