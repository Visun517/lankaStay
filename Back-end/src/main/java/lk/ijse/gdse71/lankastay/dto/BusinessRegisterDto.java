package lk.ijse.gdse71.lankastay.dto;

import lk.ijse.gdse71.lankastay.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusinessRegisterDto {
    private String userName;
    private String password;
    private String email;
    private Role role;
    private String type;
    private String phoneNumber;
}
