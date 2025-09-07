package lk.ijse.gdse71.lankastay.repository;

import lk.ijse.gdse71.lankastay.entity.ClosedDate;
import lk.ijse.gdse71.lankastay.entity.HotelPackages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClosedDatesRepository extends JpaRepository<ClosedDate, Long> {
    List<ClosedDate> findAllByBusinessId(Long id);
}
