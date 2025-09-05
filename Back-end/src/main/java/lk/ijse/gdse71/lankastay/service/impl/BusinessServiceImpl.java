package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.BusinessDto;
import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;
import lk.ijse.gdse71.lankastay.dto.PackageDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.BusinessImage;
import lk.ijse.gdse71.lankastay.entity.HotelPackages;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.BusinessImageRepository;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.HotelPackageRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.BusinessService;
import lk.ijse.gdse71.lankastay.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class BusinessServiceImpl implements BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final BusinessImageRepository businessImageRepository;
    private final ModelMapper modelMapper;
    private final HotelPackageRepository packageRepository;

    public Object updateProfilePicture(MultipartFile file, String email) throws IOException {

        if(file.isEmpty()) {
            throw new RuntimeException("Profile picture is empty");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + user.getId()));


        String uniqueFilename = fileStorageService.saveFile(file, "business-profiles");
        String fileUrlPath = "/uploads/business-profiles/" + uniqueFilename;
        business.setImageUrl(fileUrlPath);
        businessRepository.save(business);

        return "http://localhost:8080" + fileUrlPath;
    }

    public BusinessDto getBusinessDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + id));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

       BusinessDto businessDto = modelMapper.map(business, BusinessDto.class);
       businessDto.setBusinessName(user.getName());
       return businessDto;
    }



    @Override
    public Object updateBusiness(Long id,BusinessDto businessDetails) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

        business.setLatitude(businessDetails.getLatitude());
        business.setLongitude(businessDetails.getLongitude());
        business.setDistrict(businessDetails.getDistrict());
        business.setDescription(businessDetails.getDescription());
        business.setAddress(businessDetails.getAddress());
        businessRepository.save(business);

        return "Business details updated successfully";
    }
}
