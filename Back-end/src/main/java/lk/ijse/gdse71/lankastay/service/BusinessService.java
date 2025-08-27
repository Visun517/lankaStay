package lk.ijse.gdse71.lankastay.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface BusinessService {
     Object updateProfilePicture(MultipartFile file , String email) throws IOException;
}
