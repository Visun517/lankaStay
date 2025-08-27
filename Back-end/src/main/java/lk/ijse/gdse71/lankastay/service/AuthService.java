package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.AuthDto;
import lk.ijse.gdse71.lankastay.dto.AuthResponseDto;
import lk.ijse.gdse71.lankastay.dto.BusinessRegisterDto;
import lk.ijse.gdse71.lankastay.dto.TouristRegisterDto;

public interface AuthService {
     AuthResponseDto authenticate(AuthDto authDto);
     String registerTourist(TouristRegisterDto registerDto);
     String registerBusiness(BusinessRegisterDto businessRegisterDto);

}
