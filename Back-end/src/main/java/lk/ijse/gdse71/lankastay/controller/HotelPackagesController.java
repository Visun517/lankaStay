package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.dto.PackageDto;
import lk.ijse.gdse71.lankastay.dto.SpecialOffersDto;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.HotelPackageService;
import lk.ijse.gdse71.lankastay.service.impl.SpecialOffersServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/packages")
@RequiredArgsConstructor
public class HotelPackagesController {
    private final HotelPackageService hotelPackageService;

    @PostMapping("/addNewPackage")
    public ResponseEntity<ApiResponseDto> addNewPackage(@ModelAttribute PackageDto packageDto, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "HotelPackages added successfully",
                        hotelPackageService.addPackage(packageDto, user.getId())
                )
        );

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
                        hotelPackageService.deletePackage(packageId, user.getId())
                )
        );

    }

    @GetMapping("/getRecommendedPackages")
    public ResponseEntity<ApiResponseDto> getRecommendedPackages(Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Packages fetched successfully",
                        hotelPackageService.getRecommendedPackages(user.getId())
                )
        );
    }
}
