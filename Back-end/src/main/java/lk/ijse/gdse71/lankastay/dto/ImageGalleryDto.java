package lk.ijse.gdse71.lankastay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class ImageGalleryDto {
    private MultipartFile image;
    @NotBlank(message = " Image subtitle is required")
    @Size(min = 10, max = 50, message = "Image title must be between 10 and 100 characters")
    private String title;
    @NotBlank(message = " Image subtitle is required")
    @Size(min = 10, max = 50, message = "Image subtitle must be between 10 and 50 characters")
    private String subtitle;
    private String imageUrl;
    private Long id;

}
