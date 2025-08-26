package lk.ijse.gdse71.lankastay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tourists")
public class Tourist {

        @Id
        private Long id;

        @CreatedDate
        @Column(updatable = false)
        private LocalDate createdAt;

        @CreatedDate
        private LocalDate updatedAt;

        @OneToOne(fetch = FetchType.LAZY)
        @MapsId
        @JoinColumn(name = "user_id")
        private User user;


        @OneToMany(mappedBy = "tourist", cascade = CascadeType.ALL)
        private List<Booking> bookings;

        @OneToMany(mappedBy = "tourist", cascade = CascadeType.ALL)
        private List<Review> reviews;
}