package com.finpay.api.controller;

import com.finpay.api.dto.LoginRequest;
import com.finpay.api.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }
    @PostMapping("/login")
public ResponseEntity<?> login(
        @RequestBody LoginRequest request) {

    try {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtService.generateToken(
                request.getEmail()
        );

        return ResponseEntity.ok(
                new LoginResponse(token)
        );

    } catch (org.springframework.security.core.AuthenticationException exception) {

        return ResponseEntity
                .status(401)
                .body(
                        java.util.Map.of(
                                "status", 401,
                                "error", "Unauthorized",
                                "message", "Invalid email or password"
                        )
                );
    }
}

    public static class LoginResponse {

        private final String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }
}
