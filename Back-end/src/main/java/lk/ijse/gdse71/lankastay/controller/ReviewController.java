package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.dto.ReviewDto;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("addReview")
    public ResponseEntity<ApiResponseDto> addBooking(@ModelAttribute ReviewDto reviewDto, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Add Review successfully",
                        reviewService.addReview(reviewDto, user.getId())
                )
        );
    }

    @GetMapping("/getAllReviews/{businessId}")
    public ResponseEntity<ApiResponseDto> getAllReviews(@PathVariable Long businessId,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "5") int size,
                                                        Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Get Reviews successfully",
                        reviewService.getAllReviews(businessId, page, size, user.getId())
                )
        );
    }

    @DeleteMapping("removeReview/{reviewId}")
    public ResponseEntity<ApiResponseDto> removeReview(@PathVariable Long reviewId, Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        System.out.println("1");
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Delete Reviews successfully",
                        reviewService.removeReview(reviewId, user.getId())
                )
        );

    }
}
