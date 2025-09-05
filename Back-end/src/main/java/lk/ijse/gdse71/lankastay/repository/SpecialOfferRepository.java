package lk.ijse.gdse71.lankastay.repository;

import lk.ijse.gdse71.lankastay.entity.SpecialOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecialOfferRepository extends JpaRepository<SpecialOffer, Long> {
    List<SpecialOffer> findAllByBusinessId(Long id);
}
