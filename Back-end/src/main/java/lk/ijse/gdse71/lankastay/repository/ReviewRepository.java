package lk.ijse.gdse71.lankastay.repository;

import lk.ijse.gdse71.lankastay.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review , Long> {
    Page<Review> findByBusinessId(Long businessId , Pageable pageable);
}
