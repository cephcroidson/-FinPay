package com.finpay.api.service;

import com.finpay.api.dto.RegisterUserRequest;
import com.finpay.api.entity.User;
import com.finpay.api.entity.UserStatus;
import com.finpay.api.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(RegisterUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        // Temporary only.
        // We will replace this with BCrypt hashing
        // when authentication is implemented.
        user.setPassword(request.getPassword());

        user.setStatus(UserStatus.ACTIVE);

        return userRepository.save(user);
    }
}
