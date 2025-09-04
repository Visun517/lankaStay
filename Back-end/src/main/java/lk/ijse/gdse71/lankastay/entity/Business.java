package lk.ijse.gdse71.lankastay.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lk.ijse.gdse71.lankastay.entity.types.BusinessType;
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
@Table(name = "businesses")
public class Business {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    private BusinessType businessType; // Hotel, Guest House, Spa, etc.
    private String district;

    private String phoneNumber;
    private String imageUrl;

    @CreatedDate
    @Column(updatable = false)
    private LocalDate createdAt;

    @CreatedDate
    private LocalDate updatedAt;

    private Double latitude;
    private Double longitude;
    private String description;
    private String address;


    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;


    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Package> packages;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<SpecialOffer> specialOffers;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Booking> bookings;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Review> reviews;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BusinessImage> galleryImages;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ClosedDate> closedDates;
}