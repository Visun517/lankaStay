package lk.ijse.gdse71.lankastay.repository;

import lk.ijse.gdse71.lankastay.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;

@Repository
public interface BusinessRepository extends JpaRepository<Business , Long> {
    Business findByUserId(Long userId);
}
