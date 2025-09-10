package lk.ijse.gdse71.lankastay.service.impl;
import lk.ijse.gdse71.lankastay.dto.BookingDto;
import lk.ijse.gdse71.lankastay.dto.SpecialOffersDto;
import lk.ijse.gdse71.lankastay.entity.*;
import lk.ijse.gdse71.lankastay.entity.types.StatusTypes;
import lk.ijse.gdse71.lankastay.repository.*;
import lk.ijse.gdse71.lankastay.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TouristRepository touristRepository;
    private final BusinessRepository businessRepository;
    private final HotelPackageRepository packageRepository;

    @Override
    public String addBooking(BookingDto bookingDto, Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + id));

        Tourist tourist = touristRepository.findById(bookingDto.getTouristId())
                .orElseThrow(() -> new RuntimeException("Tourist not found with id: " + id));

        Business business = businessRepository.findById(bookingDto.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

        HotelPackages hotelPackages = packageRepository.findById(bookingDto.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));

        Booking booking = Booking.builder()
                .bookingDate(bookingDto.getBookingDate())
                .status(StatusTypes.PENDING)
                .checkInDate(bookingDto.getCheckInDate())
                .checkOutDate(bookingDto.getCheckOutDate())
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .tourist(tourist)
                .business(business)
                .packageEntity(hotelPackages)
                .build();

        bookingRepository.save(booking);
        return "Booking added successfully";
    }

    @Override
    public List<BookingDto> getBookingsForTourist(Long id) {
        Tourist tourist = touristRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tourist not found with id: " + id));

        List<Booking> bookings = bookingRepository.findAllByTourist(tourist);

        List<BookingDto> bookingDtos = bookings.stream()
                .map(bookingDto -> BookingDto.builder()
                        .bookingId(bookingDto.getBooking_id())
                        .bookingDate(bookingDto.getBookingDate())
                        .status(bookingDto.getStatus())
                        .checkInDate(bookingDto.getCheckInDate())
                        .checkOutDate(bookingDto.getCheckOutDate())
                        .touristId(bookingDto.getTourist().getId())
                        .businessId(bookingDto.getBusiness().getId())
                        .packageId(bookingDto.getPackageEntity().getPackage_id())
                        .build()
                )
                .collect(Collectors.toList());
        return bookingDtos;
    }

    @Override
    public List<BookingDto> getBookingsForBusiness(Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

        List<Booking> bookings = bookingRepository.findAllByBusiness(business);

        List<BookingDto> bookingDtos = bookings.stream()
                .map(bookingDto -> BookingDto.builder()
                        .bookingId(bookingDto.getBooking_id())
                        .bookingDate(bookingDto.getBookingDate())
                        .status(bookingDto.getStatus())
                        .checkInDate(bookingDto.getCheckInDate())
                        .checkOutDate(bookingDto.getCheckOutDate())
                        .touristId(bookingDto.getTourist().getId())
                        .businessId(bookingDto.getBusiness().getId())
                        .packageId(bookingDto.getPackageEntity().getPackage_id())
                        .build()
                )
                .collect(Collectors.toList());
        return bookingDtos;

    }

    @Override
    public String updateBooking(BookingDto bookingDto, Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + id));

        System.out.println(bookingDto.getBookingId());
        Booking booking = bookingRepository.findById(bookingDto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingDto.getBookingId()));

        booking.setStatus(bookingDto.getStatus());
        bookingRepository.save(booking);
        return "Booking updated successfully";
    }

    @Override
    public String deleteBooking(Long bookingId, Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + id));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        bookingRepository.delete(booking);
        return "Booking deleted successfully";
    }
}
