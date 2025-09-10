package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.BookingDto;

import java.util.List;

public interface BookingService {
    String addBooking(BookingDto bookingDto, Long id);
    List<BookingDto> getBookingsForTourist(Long id);
    List<BookingDto> getBookingsForBusiness(Long id);
    String updateBooking(BookingDto bookingDto, Long id);
    String deleteBooking(Long bookingId, Long id);
}
