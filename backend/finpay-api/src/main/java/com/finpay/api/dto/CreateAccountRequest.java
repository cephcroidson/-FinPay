package com.finpay.api.dto;

import jakarta.validation.constraints.NotNull;

public class CreateAccountRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    public CreateAccountRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
