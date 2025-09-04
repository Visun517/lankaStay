package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.dto.BusinessDto;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.impl.BusinessServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessServiceImpl businessService;

    @PostMapping("/profilePicture")
    public ResponseEntity<ApiResponseDto> updateProfile(@RequestParam MultipartFile image, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        String email = authentication.getName();
        try {
            return ResponseEntity.ok(
                    new ApiResponseDto(
                            200,
                            "Profile updated successfully",
                            businessService.updateProfilePicture(image,email)
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/GetDetails")
    public ResponseEntity<ApiResponseDto> getBusinessDetails(Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Business details fetched successfully",
                        businessService.getBusinessDetails(user.getId())
                )
        );
    }

    @PatchMapping("/updateBusiness")
    public ResponseEntity<ApiResponseDto> updateBusiness(@RequestBody BusinessDto businessDetails,Authentication authentication) {
        System.out.println(businessDetails);
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Business details updated successfully",
                        businessService.updateBusiness(user.getId(),businessDetails)
                )
        );
    }
}
