package com.finpay.api.dto;

import com.finpay.api.entity.Transaction;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private String reference;
    private BigDecimal amount;
    private String currency;
    private String description;
    private String type;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.reference = transaction.getReference();
        this.amount = transaction.getAmount();
        this.currency = transaction.getCurrency();
        this.description = transaction.getDescription();
        this.type = transaction.getType().name();
        this.status = transaction.getStatus().name();
        this.createdAt = transaction.getCreatedAt();
        this.completedAt = transaction.getCompletedAt();
    }

    public Long getId() {
        return id;
    }

    public String getReference() {
        return reference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
