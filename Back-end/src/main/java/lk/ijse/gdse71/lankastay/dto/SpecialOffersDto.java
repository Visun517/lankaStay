package lk.ijse.gdse71.lankastay.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@Builder
public class SpecialOffersDto {
    private Long offer_id;
    private String title;
    private String description;
    private double discountPercentage;
    private LocalDate valid_from;
    private LocalDate valid_until;
    private String imageUrl;
    private MultipartFile image;

}
