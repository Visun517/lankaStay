package lk.ijse.gdse71.lankastay.dto;

import lk.ijse.gdse71.lankastay.entity.types.MealTypes;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@Builder
public class PackageDto {
    private Long id;
    private String packageName;
    private String description;
    private double price;
    private LocalDate availability_start;
    private LocalDate availability_end;
    private MealTypes meal_inclusion;
    private MultipartFile image;
    private String imageUrl;
}
