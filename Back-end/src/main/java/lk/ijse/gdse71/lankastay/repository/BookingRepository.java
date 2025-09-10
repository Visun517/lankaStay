package lk.ijse.gdse71.lankastay.repository;

import lk.ijse.gdse71.lankastay.entity.Booking;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.Tourist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking , Long> {
    List<Booking> findAllByTourist(Tourist tourist);
    List<Booking> findAllByBusiness(Business business);
}
