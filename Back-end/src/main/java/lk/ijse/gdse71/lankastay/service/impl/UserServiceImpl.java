package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    @Override
    public String getUserName(Long id) {
        User user =  userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return user.getName();
    }
}
