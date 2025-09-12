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
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    private String comment;
    private int rating; // 1-5 stars

    @CreatedDate
    @Column(updatable = false)
    private LocalDate createdAt;

    @CreatedDate
    private LocalDate updatedAt;

    // Many Reviews -> One Tourist
    @ManyToOne
    @JoinColumn(name = "tourist_id")
    private Tourist tourist;

    // Many Reviews -> One Business
    @ManyToOne
    @JoinColumn(name = "business_id")
    private Business business;
}
