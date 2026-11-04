package com.finpay.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SetTransactionPinRequest {

    @NotBlank(message = "Setup token is required")
    private String token;

    @NotBlank(message = "Transaction PIN is required")
    @Pattern(regexp = "^\\d{6}$", message = "PIN must contain exactly six digits")
    private String pin;

    @NotBlank(message = "PIN confirmation is required")
    @Pattern(regexp = "^\\d{6}$", message = "PIN confirmation must contain exactly six digits")
    private String confirmPin;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public String getConfirmPin() { return confirmPin; }
    public void setConfirmPin(String confirmPin) { this.confirmPin = confirmPin; }
}
