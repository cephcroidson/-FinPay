package com.finpay.api.otp;

import com.finpay.api.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private OtpVerificationRepository otpRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private OtpDeliveryService otpDeliveryService;

    private OtpService otpService;

    private User user;

    @BeforeEach
    void setUp() {
        otpService = new OtpService(
                otpRepository,
                passwordEncoder,
                otpDeliveryService
        );

        user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@example.com");
        user.setPhoneNumber("254700000000");
        user.setPassword("hashed-password");
    }

    @Test
    void issueOtpShouldStoreHashAndSendPlaintextOnlyToDeliveryService() {
        when(passwordEncoder.encode(anyString()))
                .thenReturn("$2a$10$hashed-value");

        otpService.issueOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                user.getEmail()
        );

        ArgumentCaptor<OtpVerification> verificationCaptor =
                ArgumentCaptor.forClass(OtpVerification.class);

        verify(otpRepository).save(verificationCaptor.capture());

        OtpVerification verification = verificationCaptor.getValue();

        assertEquals(user, verification.getUser());
        assertEquals(OtpChannel.EMAIL, verification.getChannel());
        assertEquals(OtpPurpose.REGISTRATION, verification.getPurpose());
        assertEquals("$2a$10$hashed-value", verification.getCodeHash());
        assertNotEquals(verification.getCodeHash(), user.getEmail());
        assertEquals(OtpStatus.PENDING, verification.getStatus());
        assertEquals(0, verification.getAttempts());
        assertNotNull(verification.getExpiresAt());

        ArgumentCaptor<String> otpCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(otpDeliveryService).sendOtp(
                eq(user.getEmail()),
                eq(OtpChannel.EMAIL),
                otpCaptor.capture()
        );

        String deliveredOtp = otpCaptor.getValue();

        assertNotNull(deliveredOtp);
        assertTrue(deliveredOtp.matches("\\d{6}"));

        verify(passwordEncoder).encode(deliveredOtp);
    }

    @Test
    void validOtpShouldBeAccepted() {
        OtpVerification verification = pendingVerification();

        when(
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                OtpPurpose.REGISTRATION,
                                OtpChannel.EMAIL,
                                OtpStatus.PENDING
                        )
        ).thenReturn(Optional.of(verification));

        when(passwordEncoder.matches(
                "123456",
                verification.getCodeHash()
        )).thenReturn(true);

        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                "123456"
        );

        assertTrue(result);
        assertEquals(OtpStatus.VERIFIED, verification.getStatus());
        assertEquals(1, verification.getAttempts());
        assertNotNull(verification.getVerifiedAt());

        verify(otpRepository).save(verification);
    }

    @Test
    void invalidOtpShouldBeRejected() {
        OtpVerification verification = pendingVerification();

        when(
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                OtpPurpose.REGISTRATION,
                                OtpChannel.EMAIL,
                                OtpStatus.PENDING
                        )
        ).thenReturn(Optional.of(verification));

        when(passwordEncoder.matches(
                "999999",
                verification.getCodeHash()
        )).thenReturn(false);

        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                "999999"
        );

        assertFalse(result);
        assertEquals(OtpStatus.PENDING, verification.getStatus());
        assertEquals(1, verification.getAttempts());

        verify(otpRepository).save(verification);
    }

    @Test
    void malformedOtpShouldBeRejectedWithoutDatabaseLookup() {
        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                "12345"
        );

        assertFalse(result);

        verifyNoInteractions(
                otpRepository,
                passwordEncoder
        );
    }

    @Test
    void nullOtpShouldBeRejectedWithoutDatabaseLookup() {
        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                null
        );

        assertFalse(result);

        verifyNoInteractions(
                otpRepository,
                passwordEncoder
        );
    }

    @Test
    void expiredOtpShouldBeRejectedAndMarkedExpired() {
        OtpVerification verification = pendingVerification();
        verification.setExpiresAt(LocalDateTime.now().minusMinutes(1));

        when(
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                OtpPurpose.REGISTRATION,
                                OtpChannel.EMAIL,
                                OtpStatus.PENDING
                        )
        ).thenReturn(Optional.of(verification));

        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                "123456"
        );

        assertFalse(result);
        assertEquals(OtpStatus.EXPIRED, verification.getStatus());

        verify(passwordEncoder, never())
                .matches(anyString(), anyString());

        verify(otpRepository).save(verification);
    }

    @Test
    void fifthFailedAttemptShouldFailOtp() {
        OtpVerification verification = pendingVerification();
        verification.setAttempts(4);

        when(
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                OtpPurpose.REGISTRATION,
                                OtpChannel.EMAIL,
                                OtpStatus.PENDING
                        )
        ).thenReturn(Optional.of(verification));

        when(passwordEncoder.matches(
                "999999",
                verification.getCodeHash()
        )).thenReturn(false);

        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                "999999"
        );

        assertFalse(result);
        assertEquals(5, verification.getAttempts());
        assertEquals(OtpStatus.FAILED, verification.getStatus());

        verify(otpRepository).save(verification);
    }

    @Test
    void otpAlreadyAtMaximumAttemptsShouldBeRejected() {
        OtpVerification verification = pendingVerification();
        verification.setAttempts(5);

        when(
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                OtpPurpose.REGISTRATION,
                                OtpChannel.EMAIL,
                                OtpStatus.PENDING
                        )
        ).thenReturn(Optional.of(verification));

        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                "123456"
        );

        assertFalse(result);
        assertEquals(OtpStatus.FAILED, verification.getStatus());

        verify(passwordEncoder, never())
                .matches(anyString(), anyString());

        verify(otpRepository).save(verification);
    }

    @Test
    void verifiedOtpCannotBeVerifiedAgain() {
        when(
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                OtpPurpose.REGISTRATION,
                                OtpChannel.EMAIL,
                                OtpStatus.PENDING
                        )
        ).thenReturn(Optional.empty());

        boolean result = otpService.verifyOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION,
                "123456"
        );

        assertFalse(result);

        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void resendShouldCancelPreviousPendingOtp() {
        OtpVerification existing = pendingVerification();

        when(
                otpRepository
                        .findFirstByUserAndPurposeAndChannelAndStatusOrderByCreatedAtDesc(
                                user,
                                OtpPurpose.REGISTRATION,
                                OtpChannel.EMAIL,
                                OtpStatus.PENDING
                        )
        ).thenReturn(Optional.of(existing));

        otpService.cancelPendingOtps(
                user,
                OtpPurpose.REGISTRATION,
                OtpChannel.EMAIL
        );

        assertEquals(OtpStatus.CANCELLED, existing.getStatus());

        verify(otpRepository).save(existing);
    }

    private OtpVerification pendingVerification() {
        OtpVerification verification = new OtpVerification();

        verification.setUser(user);
        verification.setChannel(OtpChannel.EMAIL);
        verification.setPurpose(OtpPurpose.REGISTRATION);
        verification.setCodeHash("$2a$10$stored-hash");
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        verification.setAttempts(0);
        verification.setStatus(OtpStatus.PENDING);

        return verification;
    }
}
