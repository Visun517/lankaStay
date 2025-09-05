package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.BusinessImage;
import lk.ijse.gdse71.lankastay.entity.User;

import java.io.IOException;
import java.util.List;

public interface BusinessImageService {
     Object uploadImageToGallery(ImageGalleryDto imageGalleryDto, String email) throws IOException;
     List<ImageGalleryDto> getImages(User user);
     Object deleteImage(Long imageId, Long id) throws IOException;
}
