package lk.ijse.gdse71.lankastay.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthDto {
    @NotNull(message="Email is required")
    @Email(message="Invalid email format")
    private String email;
    @NotNull(message="Password is required")
    @Size(min=6, message="Password must be at least 6 characters")
    private String password;
}
