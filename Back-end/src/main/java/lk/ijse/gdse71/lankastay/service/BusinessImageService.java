package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;

import java.io.IOException;
import java.util.List;

public interface BusinessImageService {
     Object uploadImageToGallery(ImageGalleryDto imageGalleryDto, String email) throws IOException;
     List<ImageGalleryDto> getImages(Long user);
     Object deleteImage(Long imageId, Long id) throws IOException;
}
