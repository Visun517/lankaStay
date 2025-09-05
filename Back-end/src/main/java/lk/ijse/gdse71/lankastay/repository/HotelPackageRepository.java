package lk.ijse.gdse71.lankastay.repository;

import lk.ijse.gdse71.lankastay.entity.HotelPackages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelPackageRepository extends JpaRepository<HotelPackages, Long> {
    List<HotelPackages> findAllByBusinessId(Long id);
}
