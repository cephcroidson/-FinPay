package com.finpay.api.service;

import com.finpay.api.entity.User;
import com.finpay.api.exception.UserNotFoundException;
import com.finpay.api.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(email));
    }
}
