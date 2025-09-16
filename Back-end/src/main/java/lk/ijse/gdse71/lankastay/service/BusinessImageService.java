package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;

import java.util.List;

public interface BusinessImageService {
     String uploadImageToGallery(ImageGalleryDto imageGalleryDto, String email);
     List<ImageGalleryDto> getImages(Long user);
     String deleteImage(Long imageId, Long id);
}
