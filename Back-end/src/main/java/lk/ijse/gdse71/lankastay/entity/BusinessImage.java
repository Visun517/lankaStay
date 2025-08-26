package lk.ijse.gdse71.lankastay.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "business_images")
public class BusinessImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String title;

    private String subtitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;
}
