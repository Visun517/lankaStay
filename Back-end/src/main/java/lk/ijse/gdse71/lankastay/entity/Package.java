package lk.ijse.gdse71.lankastay.entity;

import jakarta.persistence.*;
import lk.ijse.gdse71.lankastay.entity.types.MealTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "packages")
public class Package {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long package_id;

    private String packageName;
    private String description;
    private double price;
    private LocalDate availability_start;
    private LocalDate availability_end;
    private MealTypes meal_inclusion;

    @Column(name = "image_url")
    private String imageUrl;

    @CreatedDate
    @Column(updatable = false)
    private LocalDate createdAt;

    @CreatedDate
    private LocalDate updatedAt;

    // Many Packages -> One Business
    @ManyToOne
    @JoinColumn(name = "business_id")
    private Business business;

    // One Package -> Many Bookings
    @OneToMany(mappedBy = "packageEntity", cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
