package lk.ijse.gdse71.lankastay.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class CloseDateDto {
    private Long id;
    private LocalDate date;
}
