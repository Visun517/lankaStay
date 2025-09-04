package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path rootStorageLocation;

    public FileStorageServiceImpl(@Value("${file.storage.location}") String storagePath) {
        this.rootStorageLocation = Paths.get(storagePath);
        try {
            Files.createDirectories(this.rootStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize root storage location", e);
        }
    }


    @Override
    public String saveFile(MultipartFile file, String subDirectory) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        Path targetDirectory = this.rootStorageLocation.resolve(subDirectory);
        Files.createDirectories(targetDirectory);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        try {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } catch (Exception e) {
            // No extension
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        Path destinationFile = targetDirectory.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFilename;
    }

    @Override
    public Resource loadFile(String filename, String subDirectory) {
        try {
            Path file = this.rootStorageLocation.resolve(subDirectory).resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String filename, String subDirectory) throws IOException {
        Path file = this.rootStorageLocation.resolve(subDirectory).resolve(filename);
        Files.deleteIfExists(file);
    }
}
