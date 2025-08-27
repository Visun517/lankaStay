package lk.ijse.gdse71.lankastay.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProfilePicDto {
    private Long businessId;
    private MultipartFile image;
}
