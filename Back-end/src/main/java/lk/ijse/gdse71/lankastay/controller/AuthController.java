package lk.ijse.gdse71.lankastay.controller;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import lk.ijse.gdse71.lankastay.dto.AuthDto;
import lk.ijse.gdse71.lankastay.dto.BusinessRegisterDto;
import lk.ijse.gdse71.lankastay.dto.TouristRegisterDto;
import lk.ijse.gdse71.lankastay.service.impl.AuthServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final AuthServiceImpl authService;

    @PostMapping("/register/tourist")
    public ResponseEntity<ApiResponseDto> registerTourist(@RequestBody TouristRegisterDto registerDto) {
        return ResponseEntity.ok(
                new ApiResponseDto(
                        201,
                        "User registered successfully",
                        authService.registerTourist(registerDto)
                )
        );
    }

    @PostMapping("/register/business")
    public ResponseEntity<ApiResponseDto> registerBusiness(@RequestBody BusinessRegisterDto businessRegisterDto) {
        System.out.println(businessRegisterDto);
        return ResponseEntity.ok(
                new ApiResponseDto(
                        201,
                        "User registered successfully",
                        authService.registerBusiness(businessRegisterDto)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto> registerUser(@RequestBody AuthDto authDto) {

        return ResponseEntity.ok(
                new ApiResponseDto(
                        201,
                        "User registered successfully",
                        authService.authenticate(authDto)
                )
        );
    }
}
