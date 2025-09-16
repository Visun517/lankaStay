package lk.ijse.gdse71.lankastay.dto;


import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lk.ijse.gdse71.lankastay.entity.types.StatusTypes;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BookingDto {

    private Long bookingId;
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;
    @NotNull(message = "Booking status is required")
    private StatusTypes status;
    @FutureOrPresent(message = "Check-in date cannot be in the past")
    private LocalDate checkInDate;
    @FutureOrPresent(message = "Check-out date cannot be in the past")
    private LocalDate checkOutDate;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    @NotNull(message = "Tourist ID is required")
    private Long touristId;
    @NotNull(message = "Business ID is required")
    private Long businessId;
    @NotNull(message = "Package ID is required")
    private Long packageId;
}
