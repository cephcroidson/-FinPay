package com.finpay.api.integrations.mpesa.entity;

import com.finpay.api.entity.Account;
import com.finpay.api.entity.Transaction;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "mpesa_payments",
        indexes = {
                @Index(name = "idx_mpesa_checkout_request_id", columnList = "checkout_request_id"),
                @Index(name = "idx_mpesa_merchant_request_id", columnList = "merchant_request_id"),
                @Index(name = "idx_mpesa_account_id", columnList = "account_id")
        }
)
public class MpesaPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String paymentReference;

    @Column(length = 100)
    private String merchantRequestId;

    @Column(unique = true, length = 100)
    private String checkoutRequestId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", unique = true)
    private Transaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MpesaPaymentStatus status = MpesaPaymentStatus.INITIATED;

    @Column(length = 50)
    private String mpesaReceiptNumber;

    private Integer resultCode;

    @Column(length = 500)
    private String resultDescription;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (status == null) {
            status = MpesaPaymentStatus.INITIATED;
        }
    }

    public MpesaPayment() {
    }

    public Long getId() {
        return id;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getMerchantRequestId() {
        return merchantRequestId;
    }

    public void setMerchantRequestId(String merchantRequestId) {
        this.merchantRequestId = merchantRequestId;
    }

    public String getCheckoutRequestId() {
        return checkoutRequestId;
    }

    public void setCheckoutRequestId(String checkoutRequestId) {
        this.checkoutRequestId = checkoutRequestId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public MpesaPaymentStatus getStatus() {
        return status;
    }

    public void setStatus(MpesaPaymentStatus status) {
        this.status = status;
    }

    public String getMpesaReceiptNumber() {
        return mpesaReceiptNumber;
    }

    public void setMpesaReceiptNumber(String mpesaReceiptNumber) {
        this.mpesaReceiptNumber = mpesaReceiptNumber;
    }

    public Integer getResultCode() {
        return resultCode;
    }

    public void setResultCode(Integer resultCode) {
        this.resultCode = resultCode;
    }

    public String getResultDescription() {
        return resultDescription;
    }

    public void setResultDescription(String resultDescription) {
        this.resultDescription = resultDescription;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
