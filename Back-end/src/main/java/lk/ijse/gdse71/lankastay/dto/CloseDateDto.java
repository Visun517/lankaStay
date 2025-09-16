package lk.ijse.gdse71.lankastay.dto;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class CloseDateDto {
    private Long id;
    @FutureOrPresent(message = "Close date cannot be in the past")
    private LocalDate date;
}
