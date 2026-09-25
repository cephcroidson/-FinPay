package com.finpay.api.integrations.mpesa.repository;

import com.finpay.api.integrations.mpesa.entity.MpesaPayment;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface MpesaPaymentRepository
        extends JpaRepository<MpesaPayment, Long> {

    Optional<MpesaPayment> findByPaymentReference(
            String paymentReference
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<MpesaPayment> findByCheckoutRequestId(
            String checkoutRequestId
    );

    Optional<MpesaPayment> findByMerchantRequestId(
            String merchantRequestId
    );
}
