package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.exception.ImageUploadException;
import lk.ijse.gdse71.lankastay.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.IOException;
import java.util.Map;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${imgbb.api.key}")
    private String imgbbApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String saveFile(MultipartFile file, String subDirectory) {
        String url = "https://api.imgbb.com/1/upload?key=" + imgbbApiKey;

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", file.getResource());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map data = (Map) response.getBody().get("data");
            return (String) data.get("url");
        } else {
            throw new ImageUploadException("Failed to upload image to imgbb");
        }
    }

    @Override
    public void deleteFile(String filename, String subDirectory){
        restTemplate.getForEntity(filename, String.class);
    }
}
