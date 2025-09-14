package lk.ijse.gdse71.lankastay.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lk.ijse.gdse71.lankastay.dto.AuthDto;
import lk.ijse.gdse71.lankastay.dto.AuthResponseDto;
import lk.ijse.gdse71.lankastay.dto.BusinessRegisterDto;
import lk.ijse.gdse71.lankastay.dto.TouristRegisterDto;
import lk.ijse.gdse71.lankastay.entity.User;

public interface AuthService {
     AuthResponseDto authenticate(AuthDto authDto);
     String registerTourist(TouristRegisterDto registerDto);
     String registerBusiness(BusinessRegisterDto businessRegisterDto);
     AuthResponseDto authenticateGoogle(String email);
     String registerGoogle(GoogleIdToken.Payload payload, String businessType);
}
