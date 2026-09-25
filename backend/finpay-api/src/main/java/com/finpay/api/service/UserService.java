package com.finpay.api.service;
import com.finpay.api.exception.UserNotFoundException;
import com.finpay.api.dto.RegisterUserRequest;
import com.finpay.api.entity.User;
import com.finpay.api.entity.UserStatus;
import com.finpay.api.exception.DuplicateResourceException;
import com.finpay.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(RegisterUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already registered"
            );
        }

        String normalizedPhone = normalizePhoneNumber(request.getPhoneNumber());

        if (userRepository.existsByPhoneNumber(normalizedPhone)) {
            throw new DuplicateResourceException(
                    "Phone number already registered"
            );
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(normalizedPhone);

        // Hash password before storing it
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setStatus(UserStatus.ACTIVE);

        return userRepository.save(user);
    }
public User getUserByEmail(String email) {

    return userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new UserNotFoundException(email));
}

    private String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber.startsWith("+254")) {
            return phoneNumber.substring(1);
        }

        if (phoneNumber.startsWith("0")) {
            return "254" + phoneNumber.substring(1);
        }

        throw new IllegalArgumentException("Invalid Kenyan phone number");
    }
}
