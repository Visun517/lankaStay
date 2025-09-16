package lk.ijse.gdse71.lankastay.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lk.ijse.gdse71.lankastay.entity.types.MealTypes;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@Builder
public class PackageDto {
    private Long id;
    @NotBlank(message = "Package name is required")
    private String packageName;
    @NotBlank(message = "Job description is required")
    @Size(min = 10, max = 500, message = "Job description must be between 10 and 500 characters")
    private String description;
    @Positive(message = "Price must be greater than 0")
    private double price;
    @FutureOrPresent(message = "Availability start date cannot be in the past")
    private LocalDate availability_start;
    @FutureOrPresent(message = "Availability end date cannot be in the past")
    private LocalDate availability_end;
    @NotBlank(message = "Meal inclusion is required")
    private MealTypes meal_inclusion;
    private MultipartFile image;
    private String imageUrl;
}
