package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.BusinessDto;
import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.BusinessImage;
import lk.ijse.gdse71.lankastay.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BusinessService {
     Object updateProfilePicture(MultipartFile file , String email) throws IOException;
     Object updateBusiness(Long id , BusinessDto businessDetails);
     BusinessDto getBusinessDetails(Long id);
     Object uploadImageToGallery(ImageGalleryDto imageGalleryDto, String email) throws IOException;
     List<ImageGalleryDto> getImages(User user);
     Object deleteImage(Long imageId, Long id) throws IOException;
}
