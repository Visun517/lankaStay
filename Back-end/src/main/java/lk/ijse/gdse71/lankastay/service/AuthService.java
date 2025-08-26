package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.AuthDto;
import lk.ijse.gdse71.lankastay.dto.AuthResponseDto;
import lk.ijse.gdse71.lankastay.dto.BusinessRegisterDto;
import lk.ijse.gdse71.lankastay.dto.TouristRegisterDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.BusinessType;
import lk.ijse.gdse71.lankastay.entity.Tourist;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.TouristRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.utill.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TouristRepository touristRepository;
    private final BusinessRepository businessRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDto authenticate(AuthDto authDto) {
        User user = userRepository.findByEmail(authDto.getEmail())
                .orElseThrow(()->new RuntimeException("User not found"));


        if (!passwordEncoder.matches(
                authDto.getPassword(),
                user.getPassword())){
            throw new RuntimeException("Invalid password for user: " + authDto.getEmail());
        }

        String token = jwtUtil.generateToken(authDto.getEmail() , String.valueOf(user.getRole()));
        return new AuthResponseDto(token);
    }

    public String registerTourist(TouristRegisterDto registerDto){
        if (userRepository.findByEmail(registerDto.getEmail())
                .isPresent()){
            throw new RuntimeException("User already exists with username: " + registerDto.getUserName());
        }

        User user = User.builder()
                .email(registerDto.getEmail())
                .name(registerDto.getUserName())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(registerDto.getRole())
                .build();
        User save = userRepository.save(user);

        Tourist tourist = Tourist.builder()
                .user(save)
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .build();

        touristRepository.save(tourist);

        return "User registered successfully";
    }

    public String registerBusiness(BusinessRegisterDto businessRegisterDto){
        System.out.println(businessRegisterDto);
        if (userRepository.findByEmail(businessRegisterDto.getEmail())
                .isPresent()){
            throw new RuntimeException("User already exists with username: " + businessRegisterDto.getUserName());
        }

        User user = User.builder()
                .email(businessRegisterDto.getEmail())
                .name(businessRegisterDto.getUserName())
                .password(passwordEncoder.encode(businessRegisterDto.getPassword()))
                .role(businessRegisterDto.getRole())
                .build();
        System.out.println(user);
        User save = userRepository.save(user);

        Business business = Business.builder()
                .user(save)
                .businessType(BusinessType.valueOf(businessRegisterDto.getType()))
                .phoneNumber(businessRegisterDto.getPhoneNumber())
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .build();
        System.out.println(business);
        businessRepository.save(business);

        return "User registered successfully";
    }


}
