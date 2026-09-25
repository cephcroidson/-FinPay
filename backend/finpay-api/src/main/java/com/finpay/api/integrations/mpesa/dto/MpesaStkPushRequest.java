package com.finpay.api.integrations.mpesa.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public class MpesaStkPushRequest {

    @NotNull
    private Long accountId;

    @NotNull
    @DecimalMin(
            value = "1",
            inclusive = true,
            message = "Amount must be at least 1 KES"
    )
    @Digits(
            integer = 19,
            fraction = 0,
            message = "Amount must be a whole number"
    )
    private BigDecimal amount;

    @NotBlank
    @Pattern(
            regexp = "^(?:\\+2547\\d{8}|\\+2541\\d{8}|2547\\d{8}|2541\\d{8}|07\\d{8}|01\\d{8})$",
            message = "Phone number must be in +2547XXXXXXXX, +2541XXXXXXXX, 2547XXXXXXXX, 2541XXXXXXXX, 07XXXXXXXX, or 01XXXXXXXX format"
    )
    private String phoneNumber;

    private String description;

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
