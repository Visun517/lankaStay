package lk.ijse.gdse71.lankastay.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthDto {
    private String email;
    private String password;
}
