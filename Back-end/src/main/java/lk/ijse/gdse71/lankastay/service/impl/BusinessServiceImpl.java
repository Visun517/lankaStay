package lk.ijse.gdse71.lankastay.service.impl;

import jakarta.annotation.PostConstruct;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class BusinessServiceImpl implements BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final Path rootStorageLocation;

    public BusinessServiceImpl(BusinessRepository businessRepository, UserRepository userRepository, @Value("${file.storage.location}") String storagePath) {
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
        this.rootStorageLocation = Paths.get(storagePath);

        try {
            Files.createDirectories(this.rootStorageLocation.resolve("business-profiles"));
            Files.createDirectories(this.rootStorageLocation.resolve("business-covers"));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }


    public Object updateProfilePicture(MultipartFile file, String email) throws IOException {

        if(file.isEmpty()) {
            throw new RuntimeException("Profile picture is empty");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + user.getId()));


        String businessName = business.getUser().getName();
        String sanitizedBusinessName = businessName.toLowerCase().replaceAll("\\s+", "_").replaceAll("[^a-z0-9-]", "");
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFilename = sanitizedBusinessName + "_profile_" + System.currentTimeMillis() + "_" + originalFilename;

        Path destinationFile = this.rootStorageLocation.resolve("business-profiles").resolve(uniqueFilename);
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        String fileUrlPath = "/uploads/business-profiles/" + uniqueFilename;
        business.setImageUrl(fileUrlPath);
        businessRepository.save(business);

        return "http://localhost:8080" + fileUrlPath;
    }
}
