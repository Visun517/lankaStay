package lk.ijse.gdse71.lankastay.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewDto {
    private Long review_id;
    private String comment;
    private int rating;
    private Long touristId;
    private Long businessId;
    private String userName;
}
