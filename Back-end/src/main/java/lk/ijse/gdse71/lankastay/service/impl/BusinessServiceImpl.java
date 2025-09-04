package lk.ijse.gdse71.lankastay.service.impl;

import jakarta.annotation.PostConstruct;
import lk.ijse.gdse71.lankastay.dto.BusinessDto;
import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.BusinessImage;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.BusinessImageRepository;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
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


    @Override
    public Object uploadImageToGallery(ImageGalleryDto imageGalleryDto, String email) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + user.getId()));

        String uniqueFilename = fileStorageService.saveFile(imageGalleryDto.getImage(), "business-gallery");

        String fileUrlPath = "/uploads/business-gallery/" + uniqueFilename;

        BusinessImage galleryImage = BusinessImage.builder()
                .imageUrl(fileUrlPath)
                .business(business)
                .description(imageGalleryDto.getTitle())
                .subtitle(imageGalleryDto.getSubtitle())
                .build();

        businessImageRepository.save(galleryImage);

        return "http://localhost:8080" + fileUrlPath;

    }

    @Override
    public List<ImageGalleryDto> getImages(User user) {
        User user1 = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + user.getEmail()));

        Business business = businessRepository.findById(user1.getId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + user.getId()));
        System.out.println(user.getId());

        List<BusinessImage> images = businessImageRepository.findAllByBusinessId(business.getId());
//        System.out.println(images);

        return images.stream().map(image -> {
            ImageGalleryDto dto = new ImageGalleryDto();
            dto.setImageUrl("http://localhost:8080" + image.getImageUrl());
            dto.setTitle(image.getDescription());
            dto.setSubtitle(image.getSubtitle());
            dto.setId(image.getId());
            return dto;
        }).toList();
    }

    @Override
    public Object deleteImage(Long imageId, Long id) throws IOException {
        BusinessImage image = businessImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));

        if (!image.getBusiness().getId().equals(id)) {
            throw new RuntimeException("You are not authorized to delete this image");
        }

        businessImageRepository.delete(image);
        fileStorageService.deleteFile(image.getImageUrl() , "business-gallery");

        return "Image deleted successfully";
    }

}
