package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.BusinessImage;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.exception.FileOperationException;
import lk.ijse.gdse71.lankastay.exception.ResourceNotFoundException;
import lk.ijse.gdse71.lankastay.exception.UnauthorizedActionException;
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
    public String uploadImageToGallery(ImageGalleryDto imageGalleryDto, String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->  new ResourceNotFoundException("User not found with email: " + email));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() ->  new ResourceNotFoundException("Business not found with email: " + user.getId()));

        String imageUrl = null;
        try {
            imageUrl = fileStorageService.saveFile(imageGalleryDto.getImage(), "business-gallery");
        } catch (IOException e) {
            throw new FileOperationException("File upload failed");
        }

        BusinessImage galleryImage = BusinessImage.builder()
                .imageUrl(imageUrl)
                .business(business)
                .description(imageGalleryDto.getTitle())
                .subtitle(imageGalleryDto.getSubtitle())
                .build();

        businessImageRepository.save(galleryImage);

        return imageUrl;
    }

    @Override
    public List<ImageGalleryDto> getImages(Long id) {
        User user1 = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        Business business = businessRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Business not found with email: " + id));

        List<BusinessImage> images = businessImageRepository.findAllByBusinessId(business.getId());

        return images.stream()
                .map(image -> ImageGalleryDto.builder()
                        .id(image.getId())
                        .imageUrl(image.getImageUrl())
                        .title(image.getDescription())
                        .subtitle(image.getSubtitle())
                        .build()
                )
                .toList();

    }

    @Override
    public String deleteImage(Long imageId, Long id){
        BusinessImage imageData = businessImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        if (!imageData.getBusiness().getId().equals(id)) {
            throw new UnauthorizedActionException("You are not authorized to delete this image");
        }
        try {
            fileStorageService.deleteFile(imageData.getImageUrl(), "business-gallery");
        } catch (IOException e) {
            throw new FileOperationException("Error deleting file");
        }
        businessImageRepository.delete(imageData);

        return "Image deleted successfully";
    }
}
