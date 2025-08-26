package lk.ijse.gdse71.lankastay.utill;

import lk.ijse.gdse71.lankastay.entity.Role;
import lk.ijse.gdse71.lankastay.entity.Tourist;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.TouristRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TouristRepository touristRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // 1. User සිටීදැයි පරීක්ෂා කරනවා
        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        String targetUrl;

        if (userOptional.isPresent()) {
            // --- 2a. User දැනටමත් සිටීනම් (EXISTING USER - LOGIN) ---
            user = userOptional.get();
            System.out.println("Existing user logged in via Google: " + user.getEmail());

            // JWT token එකක් ජනනය කරනවා
            String jwtToken = jwtUtil.generateToken(user.getName() , user.getRole().name());

            // Dashboard එකට redirect කරනවා
            targetUrl = "http://127.0.0.1:5500/pages/tourist/TouristDashboard.html?token=" + jwtToken;

        } else {
            // --- 2b. User නොමැතිනම් (NEW USER - SIGN-UP) ---
            System.out.println("New user registered via Google: " + email);

            // නව User සහ Tourist profile එකක් නිර්මාණය කරනවා
            User newUser = User.builder()
                    .email(email)
                    .name(name)
                    .password(passwordEncoder.encode("OAUTH2_USER_PASSWORD_PLACEHOLDER"))
                    .role(Role.TOURIST)
                    .build();
            user = userRepository.save(newUser); // user ව save කරනවා

            Tourist newTourist = Tourist.builder()
                    .user(user)
                    .createdAt(LocalDate.now())
                    .updatedAt(LocalDate.now())
                    .build();
            touristRepository.save(newTourist);

            // Login පිටුවට, සාර්ථක පණිවිඩයක් සමඟ redirect කරනවා
            targetUrl = "http://127.0.0.1:5500/pages/LogIn.html?registration=success";
        }

        // 3. අවසාන වශයෙන්, තීරණය කළ targetUrl එකට redirect කරනවා
        response.sendRedirect(targetUrl);
    }
}