package lk.ijse.gdse71.lankastay.exception;

import io.jsonwebtoken.ExpiredJwtException;
import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponseDto handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return new ApiResponseDto(404, "User not found",ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponseDto handlerBadCredentialsException(Exception ex) {
        return new ApiResponseDto(400, "Invalid credentials", null);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponseDto handlerJWTTokenExpiredException(Exception ex) {
        return new ApiResponseDto(401, "JWT token expired", ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponseDto handlerAllException(Exception ex) {
        return new ApiResponseDto(500,"Internal server error" , ex.getMessage()
        );
    }
}
