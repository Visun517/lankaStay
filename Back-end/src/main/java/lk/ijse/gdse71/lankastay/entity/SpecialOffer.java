package lk.ijse.gdse71.lankastay.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "special_offers")
public class SpecialOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long offer_id;

    private String title;
    private String description;
    private double discountPercentage;
    private LocalDate valid_from;
    private LocalDate valid_until;

    @Column(name = "image_url")
    private String imageUrl;

    @CreatedDate
    @Column(updatable = false)
    private LocalDate createdAt;

    @CreatedDate
    private LocalDate updatedAt;

    // Many Offers -> One Business
    @ManyToOne
    @JoinColumn(name = "business_id")
    @JsonManagedReference
    private Business business;
}
