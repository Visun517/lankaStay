package lk.ijse.gdse71.lankastay.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ImageGalleryDto {
    private MultipartFile image;
    private String title;
    private String subtitle;
    private String imageUrl;
    private Long id;

}
