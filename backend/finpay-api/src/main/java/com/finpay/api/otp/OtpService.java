package com.finpay.api.otp;

import com.finpay.api.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRATION_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;

    private final OtpVerificationRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpDeliveryService otpDeliveryService;
    private final SecureRandom secureRandom;

    public OtpService(
            OtpVerificationRepository otpRepository,
            PasswordEncoder passwordEncoder,
            OtpDeliveryService otpDeliveryService
    ) {
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpDeliveryService = otpDeliveryService;
        this.secureRandom = new SecureRandom();
    }

    @Transactional
    public void issueOtp(
            User user,
            OtpChannel channel,
            OtpPurpose purpose,
            String destination
    ) {
        cancelPendingOtps(user, purpose, channel);

        String otp = generateSecureOtp();

        OtpVerification verification = new OtpVerification();
        verification.setUser(user);
        verification.setChannel(channel);
        verification.setPurpose(purpose);
        verification.setCodeHash(passwordEncoder.encode(otp));
        verification.setExpiresAt(
                LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES)
        );
        verification.setAttempts(0);
        verification.setStatus(OtpStatus.PENDING);

        otpRepository.save(verification);

        otpDeliveryService.sendOtp(destination, channel, otp);
    }

    @Transactional
    public boolean verifyOtp(
            User user,
            OtpChannel channel,
            OtpPurpose purpose,
            String submittedOtp
    ) {
        if (submittedOtp == null || !submittedOtp.matches("\\d{6}")) {
            return false;
        }

        OtpVerification verification =
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                purpose,
                                channel,
                                OtpStatus.PENDING
                        )
                        .orElse(null);

        if (verification == null) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();

        if (!now.isBefore(verification.getExpiresAt())) {
            verification.setStatus(OtpStatus.EXPIRED);
            otpRepository.save(verification);
            return false;
        }

        if (verification.getAttempts() >= MAX_ATTEMPTS) {
            verification.setStatus(OtpStatus.FAILED);
            otpRepository.save(verification);
            return false;
        }

        verification.setAttempts(verification.getAttempts() + 1);

        boolean valid =
                passwordEncoder.matches(
                        submittedOtp,
                        verification.getCodeHash()
                );

        if (!valid) {
            if (verification.getAttempts() >= MAX_ATTEMPTS) {
                verification.setStatus(OtpStatus.FAILED);
            }

            otpRepository.save(verification);
            return false;
        }

        verification.setStatus(OtpStatus.VERIFIED);
        verification.setVerifiedAt(now);

        otpRepository.save(verification);

        return true;
    }

    @Transactional
    public void cancelPendingOtps(
            User user,
            OtpPurpose purpose,
            OtpChannel channel
    ) {
        otpRepository
                .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                        user,
                        purpose,
                        channel,
                        OtpStatus.PENDING
                )
                .ifPresent(verification -> {
                    verification.setStatus(OtpStatus.CANCELLED);
                    otpRepository.save(verification);
                });
    }

    private String generateSecureOtp() {
        int upperBound = (int) Math.pow(10, OTP_LENGTH);

        int value = secureRandom.nextInt(upperBound);

        return String.format("%0" + OTP_LENGTH + "d", value);
    }
}
