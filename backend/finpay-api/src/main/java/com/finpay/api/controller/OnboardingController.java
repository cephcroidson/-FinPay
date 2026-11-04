package com.finpay.api.controller;

import com.finpay.api.dto.RegisterUserRequest;
import com.finpay.api.dto.SetPasswordRequest;
import com.finpay.api.dto.SetTransactionPinRequest;
import com.finpay.api.dto.VerifyEmailRequest;
import com.finpay.api.entity.Account;
import com.finpay.api.entity.User;
import com.finpay.api.service.OnboardingService;
import com.finpay.api.service.PasswordSetupResult;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterUserRequest request
    ) {
        User user = onboardingService.startRegistration(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message",
                        "Registration started. Complete email verification to continue.",
                        "publicId",
                        user.getPublicId(),
                        "email",
                        user.getEmail(),
                        "onboardingStatus",
                        user.getOnboardingStatus()
                ));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request
    ) {
        String setupToken = onboardingService.verifyEmail(
                request.getEmail(),
                request.getOtp()
        );

        if (setupToken == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Invalid, expired, or previously used verification code."
                    ));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Email verified. Continue to password setup.",
                "nextStep", "SET_PASSWORD",
                "setupToken", setupToken,
                "expiresInMinutes", 15
        ));
    }

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(
            @Valid @RequestBody SetPasswordRequest request
    ) {
        PasswordSetupResult result =
                onboardingService.setPasswordAndCreateAccount(request);

        Account account = result.account();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Account created. Set your transaction PIN to activate it.",
                        "accountNumber", account.getAccountNumber(),
                        "currency", account.getCurrency(),
                        "balance", account.getBalance(),
                        "nextStep", "SET_TRANSACTION_PIN",
                        "setupToken", result.pinSetupToken(),
                        "expiresInMinutes", 15
                ));
    }

    @PostMapping("/set-pin")
    public ResponseEntity<?> setPin(
            @Valid @RequestBody SetTransactionPinRequest request
    ) {
        onboardingService.setTransactionPin(request);

        return ResponseEntity.ok(Map.of(
                "message", "Transaction PIN configured. Your FinPay account is now active.",
                "onboardingStatus", "ACTIVE"
        ));
    }
}
