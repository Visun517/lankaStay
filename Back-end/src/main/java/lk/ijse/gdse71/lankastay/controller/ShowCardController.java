package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.BusinessImageService;
import lk.ijse.gdse71.lankastay.service.ClosedDatesService;
import lk.ijse.gdse71.lankastay.service.HotelPackageService;
import lk.ijse.gdse71.lankastay.service.SpecialOfferService;
import lk.ijse.gdse71.lankastay.service.impl.BusinessServiceImpl;
import lk.ijse.gdse71.lankastay.service.impl.SpecialOffersServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/showCard")
@RequiredArgsConstructor
public class ShowCardController {

    private final BusinessServiceImpl businessService;
    private final ClosedDatesService closeDateService;
    private final BusinessImageService businessImageService;
    private final SpecialOfferService specialOfferService;
    private final HotelPackageService hotelPackageService;

    @GetMapping("/getProfile/contact/{businessId}")
    public ResponseEntity<ApiResponseDto> getProfile(Authentication authentication, @PathVariable String businessId) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Profile fetched successfully",
                        businessService.getProfileAndContact(businessId, user.getId())
                )
        );
    }

    @GetMapping("/getAllDates/{businessId}")
    public ResponseEntity<ApiResponseDto> getAllDates(@PathVariable Long businessId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Packages fetched successfully",
                        closeDateService.getAllDates(businessId)
                )
        );
    }

    @GetMapping("/getImages/{businessId}")
    public ResponseEntity<ApiResponseDto> getImages(@PathVariable Long businessId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Images fetched successfully",
                        businessImageService.getImages(businessId)
                )
        );
    }

    @GetMapping("/getAllOffers/{businessId}")
    public ResponseEntity<ApiResponseDto> getAllOffers(@PathVariable Long businessId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Packages fetched successfully",
                        specialOfferService.getAllOffers(businessId)
                )
        );
    }

    @GetMapping("/getAllPackages/{businessId}")
    public ResponseEntity<ApiResponseDto> getAllPackages(@PathVariable Long businessId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Packages fetched successfully",
                        hotelPackageService.getAllPackages(businessId)
                )
        );
    }
}
