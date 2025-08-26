package lk.ijse.gdse71.lankastay.entity;

import jakarta.persistence.*;
import lk.ijse.gdse71.lankastay.entity.types.StatusTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long booking_id;

    private String bookingDate;

    @Enumerated(EnumType.STRING)
    private StatusTypes status; // PENDING, CONFIRMED, CANCELLED

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    @CreatedDate
    @Column(updatable = false)
    private LocalDate createdAt;

    @CreatedDate
    private LocalDate updatedAt;

    // Many Bookings -> One Tourist
    @ManyToOne
    @JoinColumn(name = "tourist_id")
    private Tourist tourist;

    // Many Bookings -> One Business
    @ManyToOne
    @JoinColumn(name = "business_id")
    private Business business;

    // Many Bookings -> One Package
    @ManyToOne
    @JoinColumn(name = "package_id")
    private Package packageEntity;
}
