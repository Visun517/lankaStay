package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.dto.CloseDateDto;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.service.ClosedDatesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/calender")
@RequiredArgsConstructor
public class CloseDateController {

    private final ClosedDatesService closeDateService;

    @PostMapping("/addClosedDate")
    public ResponseEntity<ApiResponseDto> addClosedDate(@ModelAttribute CloseDateDto closeDateDto, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Business details updated successfully",
                        closeDateService.addClosedDate(user.getId(),closeDateDto)
                )
        );
    }
    @DeleteMapping("/removeClosedDate/{dateId}")
    public ResponseEntity<ApiResponseDto> removeClosedDate(@PathVariable Long dateId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Business details updated successfully",
                        closeDateService.removeClosedDate(user.getId(),dateId)
                )
        );
    }

    @GetMapping("/getAllDates")
    public ResponseEntity<ApiResponseDto> getAllOffers(Authentication authentication) {
        if (authentication == null) {
            return new ResponseEntity<>(new ApiResponseDto(401, "Unauthorized access", null), HttpStatus.UNAUTHORIZED);
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponseDto(
                        200,
                        "Packages fetched successfully",
                        closeDateService.getAllDates(user.getId())
                )
        );
    }
}
