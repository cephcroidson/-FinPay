package com.finpay.api.integrations.mpesa.service;

import com.finpay.api.entity.Account;
import com.finpay.api.entity.Transaction;
import com.finpay.api.entity.TransactionStatus;
import com.finpay.api.integrations.mpesa.dto.MpesaCallbackRequest;
import com.finpay.api.integrations.mpesa.entity.MpesaPayment;
import com.finpay.api.integrations.mpesa.entity.MpesaPaymentStatus;
import com.finpay.api.integrations.mpesa.repository.MpesaPaymentRepository;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MpesaCallbackService {

    private final MpesaPaymentRepository mpesaPaymentRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public MpesaCallbackService(
            MpesaPaymentRepository mpesaPaymentRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.mpesaPaymentRepository = mpesaPaymentRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void processCallback(MpesaCallbackRequest request) {

        if (request == null
                || request.getBody() == null
                || request.getBody().getStkCallback() == null) {
            throw new IllegalArgumentException(
                    "Invalid M-Pesa callback payload");
        }

        MpesaCallbackRequest.StkCallback callback =
                request.getBody().getStkCallback();

        String checkoutRequestId =
                callback.getCheckoutRequestId();

        if (checkoutRequestId == null
                || checkoutRequestId.isBlank()) {
            throw new IllegalArgumentException(
                    "Missing CheckoutRequestID");
        }

        MpesaPayment payment =
                mpesaPaymentRepository
                        .findByCheckoutRequestId(checkoutRequestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "M-Pesa payment not found"));

        /*
         * Idempotency protection:
         *
         * If the callback was already processed successfully,
         * do not credit the account again.
         */
        if (payment.getStatus() == MpesaPaymentStatus.COMPLETED) {
            return;
        }

        if (callback.getResultCode() == null) {
            markFailed(
                    payment,
                    null,
                    "Missing M-Pesa ResultCode");
            return;
        }

        payment.setResultCode(callback.getResultCode());
        payment.setResultDescription(
                callback.getResultDescription());

        if (callback.getResultCode() != 0) {
            markFailed(
                    payment,
                    callback.getResultCode(),
                    callback.getResultDescription());

            return;
        }

        CallbackMetadataValues metadata =
                extractMetadata(callback.getCallbackMetadata());

        validateSuccessfulCallback(
                payment,
                metadata);

        Transaction transaction =
                payment.getTransaction();

        if (transaction == null) {
            throw new IllegalStateException(
                    "M-Pesa payment has no linked transaction");
        }

        if (transaction.getStatus() == TransactionStatus.COMPLETED) {
            payment.setStatus(MpesaPaymentStatus.COMPLETED);
            payment.setMpesaReceiptNumber(
                    metadata.mpesaReceiptNumber);
            payment.setCompletedAt(LocalDateTime.now());

            mpesaPaymentRepository.save(payment);
            return;
        }

        Account account = payment.getAccount();

        /*
         * Credit the FinPay account only after M-Pesa confirms
         * successful processing.
         */
        BigDecimal currentBalance = account.getBalance();

        if (currentBalance == null) {
            currentBalance = BigDecimal.ZERO;
        }

        account.setBalance(
                currentBalance.add(payment.getAmount()));

        accountRepository.save(account);

        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());

        transactionRepository.save(transaction);

        payment.setStatus(MpesaPaymentStatus.COMPLETED);
        payment.setMpesaReceiptNumber(
                metadata.mpesaReceiptNumber);
        payment.setCompletedAt(LocalDateTime.now());

        mpesaPaymentRepository.save(payment);
    }

    private void validateSuccessfulCallback(
            MpesaPayment payment,
            CallbackMetadataValues metadata) {

        if (metadata.amount == null) {
            throw new IllegalArgumentException(
                    "M-Pesa callback is missing Amount");
        }

        if (metadata.mpesaReceiptNumber == null
                || metadata.mpesaReceiptNumber.isBlank()) {
            throw new IllegalArgumentException(
                    "M-Pesa callback is missing receipt number");
        }

        if (metadata.amount.compareTo(payment.getAmount()) != 0) {
            throw new IllegalArgumentException(
                    "M-Pesa callback amount does not match payment");
        }

        if (metadata.phoneNumber != null
                && !normalizePhone(metadata.phoneNumber)
                .equals(normalizePhone(payment.getPhoneNumber()))) {

            throw new IllegalArgumentException(
                    "M-Pesa callback phone number does not match payment");
        }
    }

    private void markFailed(
            MpesaPayment payment,
            Integer resultCode,
            String description) {

        payment.setResultCode(resultCode);
        payment.setResultDescription(description);
        payment.setStatus(MpesaPaymentStatus.FAILED);

        mpesaPaymentRepository.save(payment);

        Transaction transaction =
                payment.getTransaction();

        if (transaction != null
                && transaction.getStatus()
                != TransactionStatus.COMPLETED) {

            transaction.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(transaction);
        }
    }

    private CallbackMetadataValues extractMetadata(
            MpesaCallbackRequest.CallbackMetadata metadata) {

        CallbackMetadataValues values =
                new CallbackMetadataValues();

        if (metadata == null
                || metadata.getItems() == null) {
            return values;
        }

        List<MpesaCallbackRequest.CallbackItem> items =
                metadata.getItems();

        for (MpesaCallbackRequest.CallbackItem item : items) {

            if (item == null || item.getName() == null) {
                continue;
            }

            switch (item.getName()) {

                case "Amount":
                    values.amount =
                            toBigDecimal(item.getValue());
                    break;

                case "MpesaReceiptNumber":
                    values.mpesaReceiptNumber =
                            toStringValue(item.getValue());
                    break;

                case "PhoneNumber":
                    values.phoneNumber =
                            toStringValue(item.getValue());
                    break;

                default:
                    break;
            }
        }

        return values;
    }

    private BigDecimal toBigDecimal(Object value) {

        if (value == null) {
            return null;
        }

        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }

        if (value instanceof Number) {
            return new BigDecimal(value.toString());
        }

        try {
            return new BigDecimal(value.toString());
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private String toStringValue(Object value) {

        return value == null
                ? null
                : value.toString();
    }

    private String normalizePhone(String phone) {

        if (phone == null) {
            return "";
        }

        String normalized = phone.trim();

        if (normalized.startsWith("+254")) {
            return normalized.substring(1);
        }

        if (normalized.startsWith("0")) {
            return "254" + normalized.substring(1);
        }

        return normalized;
    }

    private static class CallbackMetadataValues {

        private BigDecimal amount;
        private String mpesaReceiptNumber;
        private String phoneNumber;
    }
}
