package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.BusinessImage;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.BusinessImageRepository;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.BusinessImageService;
import lk.ijse.gdse71.lankastay.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BusinessImageServiceImpl implements BusinessImageService {
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final FileStorageService fileStorageService;
    private final BusinessImageRepository businessImageRepository;


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

        return images.stream()
                .map(image -> ImageGalleryDto.builder()
                        .id(image.getId())
                        .imageUrl("http://localhost:8080" + image.getImageUrl())
                        .title(image.getDescription())
                        .subtitle(image.getSubtitle())
                        .build()
                )
                .toList();

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
