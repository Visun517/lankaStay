package lk.ijse.gdse71.lankastay.exception;

import lk.ijse.gdse71.lankastay.dto.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponseDto handlerBadCredentialsException(Exception ex) {
        return new ApiResponseDto(400, "Invalid credentials", null);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponseDto> handleResourceNotFoundException(ResourceNotFoundException e) {
        return new ResponseEntity<>(
                new ApiResponseDto(404,"Not found", e.getMessage()),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ApiResponseDto> handleUnauthorizedActionException(UnauthorizedActionException e) {
        return new ResponseEntity<>(
                new ApiResponseDto(401,"Unauthorized Action", e.getMessage()),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(ImageUploadException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponseDto> handleImageUploadException(ImageUploadException e) {
        return new ResponseEntity<>(
                new ApiResponseDto(500,"Image upload failed", e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(UserExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiResponseDto> handleUserExistsException(ImageUploadException e) {
        return new ResponseEntity<>(
                new ApiResponseDto(409,"User exists", e.getMessage()),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(FileOperationException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponseDto> handleFileOperationException(ImageUploadException e) {
        return new ResponseEntity<>(
                new ApiResponseDto(500,"File delete failed", e.getMessage()),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String , String > error =  new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(errorField -> {
            error.put(errorField.getField(), errorField.getDefaultMessage());
        });
        return new ResponseEntity<>(
                new ApiResponseDto(400, "Validation error", error),
                HttpStatus.BAD_REQUEST
        );
    }
}
