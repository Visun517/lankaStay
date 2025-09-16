package lk.ijse.gdse71.lankastay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewDto {
    private Long review_id;
    @NotBlank(message = "Review comment is required")
    @Size(min = 10, max = 500, message = "Review comment must be between 10 and 250 characters")
    private String comment;
    private int rating;
    private Long touristId;
    private Long businessId;
    @NotBlank(message = "User name is required")
    private String userName;
}
