package lk.ijse.gdse71.lankastay.dto;

import lk.ijse.gdse71.lankastay.entity.types.RoleTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TouristRegisterDto {
    private String userName;
    private String password;
    private String email;
    private RoleTypes role;
}
