package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.dto.SpecialOffersDto;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.impl.SpecialOffersServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/offers")
@RequiredArgsConstructor
public class SpecialOffersController {

    private final SpecialOffersServiceImpl specialOffersService;

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
        try {
            return ResponseEntity.ok(
                    new ApiResponseDto(
                            200,
                            "Image deleted successfully",
                            specialOffersService.deleteOffer(offerId,user.getId())
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
