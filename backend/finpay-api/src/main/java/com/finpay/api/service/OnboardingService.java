package com.finpay.api.service;

import com.finpay.api.dto.RegisterUserRequest;
import com.finpay.api.dto.SetPasswordRequest;
import com.finpay.api.dto.SetTransactionPinRequest;
import com.finpay.api.entity.Account;
import com.finpay.api.entity.OnboardingStatus;
import com.finpay.api.entity.OnboardingToken;
import com.finpay.api.entity.User;
import com.finpay.api.entity.UserStatus;
import com.finpay.api.entity.VerificationStatus;
import com.finpay.api.exception.DuplicateResourceException;
import com.finpay.api.exception.UserNotFoundException;
import com.finpay.api.otp.OtpChannel;
import com.finpay.api.otp.OtpPurpose;
import com.finpay.api.otp.OtpService;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.OnboardingTokenRepository;
import com.finpay.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
public class OnboardingService {

    private static final String PASSWORD_PURPOSE = "SET_PASSWORD";
    private static final String PIN_PURPOSE = "SET_TRANSACTION_PIN";
    private static final int TOKEN_EXPIRY_MINUTES = 15;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final OnboardingTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public OnboardingService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            OnboardingTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            OtpService otpService
    ) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
    }

    @Transactional
    public User startRegistration(RegisterUserRequest request) {

        String email = request.getEmail().trim().toLowerCase();
        String phone = normalizePhoneNumber(request.getPhoneNumber());

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered");
        }

        if (userRepository.existsByPhoneNumber(phone)) {
            throw new DuplicateResourceException("Phone number already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);
        user.setPhoneNumber(phone);

        // No usable password exists until the verified user sets one.
        user.setPassword(passwordEncoder.encode(
                UUID.randomUUID() + UUID.randomUUID().toString()
        ));

        user.setStatus(UserStatus.PENDING);
        user.setEmailVerified(false);
        user.setPhoneVerified(false);
        user.setVerificationStatus(VerificationStatus.PENDING);
        user.setOnboardingStatus(OnboardingStatus.OTP_PENDING);

        User savedUser = userRepository.save(user);

        otpService.issueOtp(
                savedUser,
                OtpChannel.EMAIL,
                OtpPurpose.EMAIL_VERIFICATION,
                savedUser.getEmail()
        );

        return savedUser;
    }

    /**
     * Returns a one-time password setup token only after successful OTP
     * verification. Returns null for invalid, expired, or already-used OTPs.
     */
    @Transactional
    public String verifyEmail(String email, String otp) {

        User user = userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() -> new UserNotFoundException(email));

        // Do not let a repeated verification request mint another token.
        if (user.isEmailVerified()
                || user.getStatus() != UserStatus.PENDING) {
            return null;
        }

        boolean verified = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.EMAIL_VERIFICATION,
                otp
        );

        if (!verified) {
            return null;
        }

        user.setEmailVerified(true);
        user.setVerificationStatus(VerificationStatus.VERIFIED);
        user.setOnboardingStatus(OnboardingStatus.CONTACT_VERIFIED);
        userRepository.save(user);

        return issueToken(user, PASSWORD_PURPOSE);
    }

    @Transactional
    public PasswordSetupResult setPasswordAndCreateAccount(
            SetPasswordRequest request
    ) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        OnboardingToken token = consumeToken(
                request.getToken(),
                PASSWORD_PURPOSE
        );

        User user = token.getUser();

        if (!user.isEmailVerified()
                || user.getStatus() != UserStatus.PENDING) {
            throw new IllegalStateException(
                    "This account is not eligible for password setup"
            );
        }

        if (accountRepository.findByUserId(user.getId()).isPresent()) {
            throw new DuplicateResourceException(
                    "User already has a FinPay account"
            );
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setOnboardingStatus(OnboardingStatus.PIN_PENDING);

        // The user deliberately remains PENDING until PIN setup succeeds.
        user.setStatus(UserStatus.PENDING);
        userRepository.save(user);

        Account account = new Account();
        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());
        account.setBalance(BigDecimal.ZERO);
        account.setCurrency("KES");

        Account savedAccount = accountRepository.save(account);

        String pinToken = issueToken(user, PIN_PURPOSE);

        return new PasswordSetupResult(savedAccount, pinToken);
    }

    @Transactional
    public void setTransactionPin(SetTransactionPinRequest request) {

        if (!request.getPin().equals(request.getConfirmPin())) {
            throw new IllegalArgumentException("PINs do not match");
        }

        if (request.getPin().matches("(\\d)\\1{5}")
                || request.getPin().equals("123456")
                || request.getPin().equals("654321")) {
            throw new IllegalArgumentException(
                    "Choose a less predictable transaction PIN"
            );
        }

        OnboardingToken token = consumeToken(
                request.getToken(),
                PIN_PURPOSE
        );

        User user = token.getUser();

        if (!user.isEmailVerified()
                || user.getStatus() != UserStatus.PENDING
                || accountRepository.findByUserId(user.getId()).isEmpty()) {
            throw new IllegalStateException(
                    "This account is not eligible for PIN setup"
            );
        }

        user.setTransactionPinHash(passwordEncoder.encode(request.getPin()));
        user.setPinFailedAttempts(0);
        user.setPinLockedUntil(null);
        user.setStatus(UserStatus.ACTIVE);
        user.setOnboardingStatus(OnboardingStatus.ACTIVE);

        userRepository.save(user);
    }

    private String issueToken(User user, String purpose) {

        // Invalidate any earlier unconsumed token for the same step.
        List<OnboardingToken> previousTokens =
                tokenRepository.findAllByUser_IdAndPurposeAndConsumedAtIsNull(
                        user.getId(),
                        purpose
                );

        LocalDateTime now = LocalDateTime.now();

        previousTokens.forEach(previous -> previous.setConsumedAt(now));
        tokenRepository.saveAll(previousTokens);

        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        OnboardingToken token = new OnboardingToken();
        token.setUser(user);
        token.setTokenHash(sha256(rawToken));
        token.setPurpose(purpose);
        token.setExpiresAt(now.plusMinutes(TOKEN_EXPIRY_MINUTES));

        tokenRepository.save(token);

        // Plaintext is returned once to the verified client only.
        return rawToken;
    }

    private OnboardingToken consumeToken(String rawToken, String expectedPurpose) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Setup token is required");
        }

        OnboardingToken token = tokenRepository
                .findByTokenHashForUpdate(sha256(rawToken))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid or expired setup token"
                ));

        LocalDateTime now = LocalDateTime.now();

        if (!expectedPurpose.equals(token.getPurpose())
                || token.getConsumedAt() != null
                || !token.getExpiresAt().isAfter(now)) {
            throw new IllegalArgumentException(
                    "Invalid or expired setup token"
            );
        }

        token.setConsumedAt(now);
        tokenRepository.save(token);

        return token;
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable",
                    exception
            );
        }
    }

    private String normalizePhoneNumber(String phoneNumber) {

        String normalized = phoneNumber.trim();

        if (normalized.startsWith("+254")) {
            normalized = normalized.substring(1);
        } else if (normalized.startsWith("0")) {
            normalized = "254" + normalized.substring(1);
        }

        if (!normalized.matches("^2547\\d{8}$")) {
            throw new IllegalArgumentException(
                    "Invalid Kenyan phone number"
            );
        }

        return normalized;
    }

    private String generateAccountNumber() {
        return "254"
                + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12);
    }
}
