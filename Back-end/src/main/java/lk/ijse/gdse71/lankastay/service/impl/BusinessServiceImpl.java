package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.BusinessDto;
import lk.ijse.gdse71.lankastay.dto.UserLocation;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.entity.types.BusinessType;
import lk.ijse.gdse71.lankastay.exception.ResourceNotFoundException;
import lk.ijse.gdse71.lankastay.repository.BusinessImageRepository;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.HotelPackageRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.BusinessService;
import lk.ijse.gdse71.lankastay.service.FileStorageService;
import lk.ijse.gdse71.lankastay.utill.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessServiceImpl implements BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final BusinessImageRepository businessImageRepository;
    private final ModelMapper modelMapper;
    private final HotelPackageRepository packageRepository;

    public String updateProfilePicture(MultipartFile file, String email) throws IOException {

        if(file.isEmpty()) {
            throw new ResourceNotFoundException("Profile picture is empty");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + user.getId()));

        String imageUrl = fileStorageService.saveFile(file, "business-profiles");
        business.setImageUrl(imageUrl);
        businessRepository.save(business);

        return imageUrl;
    }

    public BusinessDto getBusinessDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + id));

       BusinessDto businessDto = modelMapper.map(business, BusinessDto.class);
       businessDto.setBusinessName(user.getName());
       return businessDto;
    }

    @Override
    public String getProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + id));

        return business.getImageUrl();
    }

    @Override
    public String updateBusiness(Long id,BusinessDto businessDetails) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + id));

        business.setLatitude(businessDetails.getLatitude());
        business.setLongitude(businessDetails.getLongitude());
        business.setDistrict(businessDetails.getDistrict());
        business.setDescription(businessDetails.getDescription());
        business.setAddress(businessDetails.getAddress());
        business.setPhoneNumber(businessDetails.getPhoneNumber());
        business.setBusinessType(BusinessType.valueOf(businessDetails.getType()));
        businessRepository.save(business);

        return "Business details updated successfully";
    }

    @Override
    public List<BusinessDto> getBusinessByDistrict(String district, Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        List<Business> businessList = businessRepository.findAllByDistrict(district);

        return businessList.stream()
                .map(business -> BusinessDto.builder()
                        .address(business.getAddress())
                        .description(business.getDescription())
                        .district(business.getDistrict())
                        .latitude(business.getLatitude())
                        .longitude(business.getLongitude())
                        .phoneNumber(business.getPhoneNumber())
                        .type(String.valueOf(business.getBusinessType()))
                        .businessName(Optional.ofNullable(business.getUser())
                                .map(User::getName)
                                .orElse("Unknown"))
                        .id(business.getId())
                        .build()
                )
                .toList();

    }

    @Override
    public List<BusinessDto> getBusinessByDistrictAndCategory(String district, String category, Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        List<Business> businessList = businessRepository
                .findAllByDistrictAndBusinessType(district, BusinessType.valueOf(category));

        return businessList.stream()
                .map(business -> BusinessDto.builder()
                        .address(business.getAddress())
                        .description(business.getDescription())
                        .district(business.getDistrict())
                        .latitude(business.getLatitude())
                        .longitude(business.getLongitude())
                        .phoneNumber(business.getPhoneNumber())
                        .type(String.valueOf(business.getBusinessType()))
                        .businessName(Optional.ofNullable(business.getUser())
                                .map(User::getName)
                                .orElse("Unknown"))
                        .id(business.getId())
                        .build()
                )
                .toList();
    }

    @Override
    public BusinessDto getProfileAndContact(String businessId, Long id) {

        User user = userRepository.findById(Long.valueOf(businessId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        Business business = businessRepository.getImageUrlAndPhoneNumberByUserId(user.getId());

        return BusinessDto.builder()
                .phoneNumber(business.getPhoneNumber())
                .imageUrl(business.getImageUrl())
                .build();
    }

    @Override
    public List<BusinessDto> getNearByBusinesses(UserLocation userLocation, double radius, Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        List<Business> businesses = businessRepository.findAll();

        return businesses.stream()
                .filter(business -> business.getLatitude() != null && business.getLongitude() != null) // null avoid
                .filter(business -> GeoUtils.distance(
                        userLocation.getLatitude(),
                        userLocation.getLongitude(),
                        business.getLatitude(),
                        business.getLongitude()
                ) <= radius)
                .map(business -> BusinessDto.builder()
                        .id(business.getId())
                        .district(business.getDistrict())
                        .latitude(business.getLatitude())
                        .longitude(business.getLongitude())
                        .description(business.getDescription())
                        .address(business.getAddress())
                        .phoneNumber(business.getPhoneNumber())
                        .businessName(business.getUser().getName())
                        .type(business.getBusinessType().name())
                        .imageUrl(business.getImageUrl())
                        .build()
                )
                .collect(Collectors.toList());

    }

    @Override
    public List<BusinessDto> getNearByBusinessesByType(String type ,UserLocation userLocation, double radius, Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        List<Business> businesses = businessRepository.findAllByBusinessType(BusinessType.valueOf(type));
        System.out.println(businesses.size());

        return businesses.stream()
                .filter(business -> GeoUtils.distance(
                        userLocation.getLatitude(),
                        userLocation.getLongitude(),
                        business.getLatitude(),
                        business.getLongitude()
                ) <= radius)
                .map(business -> BusinessDto.builder()
                        .id(business.getId())
                        .district(business.getDistrict())
                        .latitude(business.getLatitude())
                        .longitude(business.getLongitude())
                        .description(business.getDescription())
                        .address(business.getAddress())
                        .phoneNumber(business.getPhoneNumber())
                        .businessName(business.getUser().getName())
                        .type(business.getBusinessType().name())
                        .imageUrl(business.getImageUrl())
                        .build()
                )
                .collect(Collectors.toList());

    }
}
