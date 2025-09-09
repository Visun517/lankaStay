package lk.ijse.gdse71.lankastay.repository;

import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.types.BusinessType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;

@Repository
public interface BusinessRepository extends JpaRepository<Business , Long> {
    Business findByUserId(Long userId);
    List<Business> findAllByDistrict(String district);
    List<Business> findAllByDistrictAndBusinessType(String district, BusinessType businessType);
    Business getImageUrlAndPhoneNumberByUserId(Long id);
}
