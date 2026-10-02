package com.finpay.api.otp;

import com.finpay.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
            User user,
            OtpPurpose purpose,
            OtpChannel channel,
            OtpStatus status
    );

    List<OtpVerification> findByUserAndStatus(
            User user,
            OtpStatus status
    );
}
