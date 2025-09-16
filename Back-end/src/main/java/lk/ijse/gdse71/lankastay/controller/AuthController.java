package lk.ijse.gdse71.lankastay.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lk.ijse.gdse71.lankastay.dto.*;
import lk.ijse.gdse71.lankastay.service.impl.AuthServiceImpl;
import lk.ijse.gdse71.lankastay.utill.GoogleTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final AuthServiceImpl authService;
    private final GoogleTokenService googleTokenService;

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

    @PostMapping("/login/google")
    public ResponseEntity<ApiResponseDto> loginWithGoogle(@RequestBody GoogleAuthDto googleAuthDto) {
        String googleToken = googleAuthDto.getToken();
        System.out.println(googleToken);

        GoogleIdToken.Payload payload = googleTokenService.verifyToken(googleToken);
        System.out.println(payload);
        if(payload == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDto(401, "Invalid token", null));
        }

        String email = payload.getEmail();

        return ResponseEntity.ok(
                new ApiResponseDto(
                        201,
                        "User Logged in successfully",
                        authService.authenticateGoogle(email)
                )
        );

    }

    @PostMapping("/register/google/{businessType}")
    public ResponseEntity<ApiResponseDto> registerWithGoogle(@PathVariable String businessType , @RequestBody GoogleAuthDto googleAuthDto) {
        String googleToken = googleAuthDto.getToken();

        GoogleIdToken.Payload payload = googleTokenService.verifyToken(googleToken);
        if(payload == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDto(401, "Invalid token", null));
        }

        return ResponseEntity.ok(
                new ApiResponseDto(
                        201,
                        "User registered in successfully",
                        authService.registerGoogle(payload ,businessType)
                )
        );

    }


}
