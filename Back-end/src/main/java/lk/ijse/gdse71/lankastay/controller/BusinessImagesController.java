package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.dto.ImageGalleryDto;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.BusinessImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class BusinessImagesController {
    private final BusinessImageService businessImageService;


    @PostMapping("/imageGallery")
    public ResponseEntity<ApiResponseDto> uploadImageToGallery(@ModelAttribute ImageGalleryDto imageGalleryDto, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        String email = authentication.getName();
        try {
            return ResponseEntity.ok(
                    new ApiResponseDto(
                            200,
                            "Image uploaded successfully",
                            businessImageService.uploadImageToGallery(imageGalleryDto,email)
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/getImages")
    public ResponseEntity<ApiResponseDto> getImages(Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Images fetched successfully",
                        businessImageService.getImages(user)
                )
        );
    }

    @DeleteMapping("/deleteImage/{imageId}")
    public ResponseEntity<ApiResponseDto> deleteImage(@PathVariable Long imageId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        try {
            return ResponseEntity.ok(
                    new ApiResponseDto(
                            200,
                            "Image deleted successfully",
                            businessImageService.deleteImage(imageId,user.getId())
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
