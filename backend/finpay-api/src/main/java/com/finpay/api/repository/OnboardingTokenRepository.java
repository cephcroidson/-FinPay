package com.finpay.api.repository;

import com.finpay.api.entity.OnboardingToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OnboardingTokenRepository
        extends JpaRepository<OnboardingToken, Long> {

    Optional<OnboardingToken> findByTokenHash(String tokenHash);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT t FROM OnboardingToken t
        WHERE t.tokenHash = :tokenHash
    """)
    Optional<OnboardingToken> findByTokenHashForUpdate(
            @Param("tokenHash") String tokenHash
    );

    List<OnboardingToken> findAllByUser_IdAndPurposeAndConsumedAtIsNull(
            Long userId,
            String purpose
    );
}
