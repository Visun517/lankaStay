package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.BusinessDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BusinessService {
     Object updateProfilePicture(MultipartFile file , String email) throws IOException;
     Object updateBusiness(Long id , BusinessDto businessDetails);
     BusinessDto getBusinessDetails(Long id);
     Object getProfile(Long id);
     List<BusinessDto> getBusinessByDistrict(String district, Long id);
     List<BusinessDto> getBusinessByDistrictAndCategory(String district, String category, Long id);
     BusinessDto getProfileAndContact(String businessId, Long id);
}
