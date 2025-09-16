package lk.ijse.gdse71.lankastay.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@Builder
public class SpecialOffersDto {
    private Long offer_id;
    private String title;
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;
    private double discountPercentage;
    @FutureOrPresent(message = "Valid-from date cannot be in the past")
    private LocalDate valid_from;
    @FutureOrPresent(message = "Valid-until date cannot be in the past")
    private LocalDate valid_until;
    private String imageUrl;
    private MultipartFile image;

}
