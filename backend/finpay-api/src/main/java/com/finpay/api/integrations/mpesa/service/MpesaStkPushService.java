package com.finpay.api.integrations.mpesa.service;

import com.finpay.api.entity.Account;
import com.finpay.api.entity.Transaction;
import com.finpay.api.integrations.mpesa.config.MpesaProperties;
import com.finpay.api.integrations.mpesa.dto.MpesaPaymentResponse;
import com.finpay.api.integrations.mpesa.dto.MpesaStkPushRequest;
import com.finpay.api.integrations.mpesa.dto.MpesaStkPushResponse;
import com.finpay.api.integrations.mpesa.entity.MpesaPayment;
import com.finpay.api.integrations.mpesa.entity.MpesaPaymentStatus;
import com.finpay.api.integrations.mpesa.repository.MpesaPaymentRepository;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.TransactionRepository;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.UUID;

@Service
public class MpesaStkPushService {

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final MpesaProperties mpesaProperties;
    private final MpesaOAuthService mpesaOAuthService;
    private final MpesaPaymentRepository mpesaPaymentRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final RestClient restClient;

    public MpesaStkPushService(
            MpesaProperties mpesaProperties,
            MpesaOAuthService mpesaOAuthService,
            MpesaPaymentRepository mpesaPaymentRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            RestClient.Builder restClientBuilder) {

        this.mpesaProperties = mpesaProperties;
        this.mpesaOAuthService = mpesaOAuthService;
        this.mpesaPaymentRepository = mpesaPaymentRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;

        this.restClient = restClientBuilder
                .baseUrl(mpesaProperties.getBaseUrl())
                .build();
    }

    public MpesaPaymentResponse initiateStkPush(
            MpesaStkPushRequest request,
            String authenticatedEmail) {

        Account account = accountRepository
                .findById(request.getAccountId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Account not found"));

        if (!account.getUser().getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException(
                    "You are not authorized to use this account");
        }

        String phoneNumber = normalizePhoneNumber(request.getPhoneNumber());

        String paymentReference = generatePaymentReference();

        String transactionDescription =
                buildTransactionDescription(request.getDescription());

        Transaction transaction = new Transaction();
        transaction.setReference("TXN-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 16)
                .toUpperCase());
        transaction.setDestinationAccount(account);
        transaction.setAmount(request.getAmount());
        transaction.setType(
                com.finpay.api.entity.TransactionType.DEPOSIT);
        transaction.setStatus(
                com.finpay.api.entity.TransactionStatus.PENDING);
        transaction.setCurrency(account.getCurrency());
        transaction.setDescription(transactionDescription);

        transaction = transactionRepository.save(transaction);

        MpesaPayment payment = new MpesaPayment();
        payment.setPaymentReference(paymentReference);
        payment.setAmount(request.getAmount());
        payment.setPhoneNumber(phoneNumber);
        payment.setAccount(account);
        payment.setTransaction(transaction);
        payment.setStatus(MpesaPaymentStatus.INITIATED);

        payment = mpesaPaymentRepository.save(payment);

        String timestamp = LocalDateTime.now()
                .format(TIMESTAMP_FORMAT);

        String password = generatePassword(timestamp);

        String accessToken = mpesaOAuthService
                .getAccessToken()
                .getAccessToken();

        MpesaStkPushResponse stkResponse = restClient.post()
                .uri("/mpesa/stkpush/v1/processrequest")
                .contentType(MediaType.APPLICATION_JSON)
                .header(
                        "Authorization",
                        "Bearer " + accessToken)
                .body("""
                        {
                          "BusinessShortCode": "%s",
                          "Password": "%s",
                          "Timestamp": "%s",
                          "TransactionType": "CustomerPayBillOnline",
                          "Amount": %s,
                          "PartyA": "%s",
                          "PartyB": "%s",
                          "PhoneNumber": "%s",
                          "CallBackURL": "%s",
                          "AccountReference": "%s",
                          "TransactionDesc": "%s"
                        }
                        """.formatted(
                        mpesaProperties.getShortcode(),
                        password,
                        timestamp,
                        request.getAmount().stripTrailingZeros().toPlainString(),
                        phoneNumber,
                        mpesaProperties.getShortcode(),
                        phoneNumber,
                        mpesaProperties.getCallbackUrl(),
                        paymentReference,
                        escapeJson(transactionDescription)))
                .retrieve()
                .body(MpesaStkPushResponse.class);

        if (stkResponse == null) {
            payment.setStatus(MpesaPaymentStatus.FAILED);
            payment.setResultDescription("Empty response from M-Pesa");
            mpesaPaymentRepository.save(payment);

            transaction.setStatus(
                    com.finpay.api.entity.TransactionStatus.FAILED);
            transactionRepository.save(transaction);

            throw new IllegalStateException(
                    "M-Pesa returned an empty STK Push response");
        }

        payment.setMerchantRequestId(
                stkResponse.getMerchantRequestId());
        payment.setCheckoutRequestId(
                stkResponse.getCheckoutRequestId());

        payment.setResultDescription(
                stkResponse.getResponseDescription());

        if ("0".equals(stkResponse.getResponseCode())) {
            payment.setStatus(MpesaPaymentStatus.PENDING);
        } else {
            payment.setStatus(MpesaPaymentStatus.FAILED);

            transaction.setStatus(
                    com.finpay.api.entity.TransactionStatus.FAILED);

            transactionRepository.save(transaction);
        }

        mpesaPaymentRepository.save(payment);

        return toResponse(
                payment,
                stkResponse);
    }

    private String generatePassword(String timestamp) {
        String rawPassword =
                mpesaProperties.getShortcode()
                        + mpesaProperties.getPasskey()
                        + timestamp;

        return Base64.getEncoder()
                .encodeToString(
                        rawPassword.getBytes(StandardCharsets.UTF_8));
    }

    private String normalizePhoneNumber(String phoneNumber) {

        if (phoneNumber.startsWith("0")) {
            return "254" + phoneNumber.substring(1);
        }

        if (phoneNumber.startsWith("+254")) {
            return phoneNumber.substring(1);
        }

        if (phoneNumber.startsWith("254")) {
            return phoneNumber;
        }

        throw new IllegalArgumentException(
                "Invalid Kenyan phone number");
    }

    private String generatePaymentReference() {
        return "FP"
                + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 10)
                        .toUpperCase();
    }

    private String buildTransactionDescription(String description) {

        String value =
                description != null && !description.isBlank()
                        ? description.trim()
                        : "FinPay Deposit";

        if (value.length() > 13) {
            value = value.substring(0, 13);
        }

        return value;
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    private MpesaPaymentResponse toResponse(
            MpesaPayment payment,
            MpesaStkPushResponse stkResponse) {

        MpesaPaymentResponse response =
                new MpesaPaymentResponse();

        response.setPaymentReference(
                payment.getPaymentReference());
        response.setAccountId(
                payment.getAccount().getId());
        response.setAmount(
                payment.getAmount());
        response.setPhoneNumber(
                payment.getPhoneNumber());
        response.setMerchantRequestId(
                payment.getMerchantRequestId());
        response.setCheckoutRequestId(
                payment.getCheckoutRequestId());
        response.setStatus(
                payment.getStatus());
        response.setResponseCode(
                stkResponse.getResponseCode());
        response.setResponseDescription(
                stkResponse.getResponseDescription());
        response.setCustomerMessage(
                stkResponse.getCustomerMessage());

        return response;
    }
}
