package com.finpay.api.dto;

public class CreateAccountRequest {

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
