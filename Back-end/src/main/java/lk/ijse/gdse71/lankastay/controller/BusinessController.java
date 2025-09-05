package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.*;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.BusinessImageService;
import lk.ijse.gdse71.lankastay.service.HotelPackageService;
import lk.ijse.gdse71.lankastay.service.impl.BusinessServiceImpl;
import lk.ijse.gdse71.lankastay.service.impl.SpecialOffersServiceImpl;
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
    private final BusinessImageService businessImageService;
    private final HotelPackageService hotelPackageService;
    private final SpecialOffersServiceImpl specialOffersService;


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
    public ResponseEntity<ApiResponseDto> updateBusiness(@RequestBody BusinessDto businessDetails, Authentication authentication) {
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

    @PostMapping("/addNewPackage")
    public ResponseEntity<ApiResponseDto> addNewPackage(@ModelAttribute PackageDto packageDto, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        try {
            return ResponseEntity.ok(
                    new ApiResponseDto(
                            200,
                            "HotelPackages added successfully",
                            hotelPackageService.addPackage(packageDto,user.getId())
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/getAllPackages")
    public ResponseEntity<ApiResponseDto> getAllPackages(Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Packages fetched successfully",
                        hotelPackageService.getAllPackages(user.getId())
                )
        );
    }

    @DeleteMapping("/deletePackage/{packageId}")
    public ResponseEntity<ApiResponseDto> deleteBusiness(@PathVariable Long packageId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Business deleted successfully",
                        hotelPackageService.deleteBusiness(packageId,user.getId())
                )
        );
    }

    @PostMapping("/addSpecialOffer")
    public ResponseEntity<ApiResponseDto> updatePackage(@ModelAttribute SpecialOffersDto specialOffersDto, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        try {
            return ResponseEntity.ok(
                    new ApiResponseDto(
                            200,
                            "Package updated successfully",
                            specialOffersService.addPackage(specialOffersDto,user.getId())
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/getAllOffers")
    public ResponseEntity<ApiResponseDto> getAllOffers(Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Packages fetched successfully",
                        specialOffersService.getAllOffers(user.getId())
                )
        );
    }
    @DeleteMapping("/deleteOffer/{offerId}")
    public ResponseEntity<ApiResponseDto> deleteOffer(@PathVariable Long offerId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Image deleted successfully",
                        specialOffersService.deleteOffer(offerId,user.getId())
                )
        );
    }
}
