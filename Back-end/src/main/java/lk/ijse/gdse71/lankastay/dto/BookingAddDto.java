package lk.ijse.gdse71.lankastay.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingAddDto {
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long packageId;
}
