package com.finpay.api.integrations.mpesa.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finpay.api.integrations.mpesa.dto.MpesaOAuthResponse;
import com.finpay.api.integrations.mpesa.service.MpesaOAuthService;

@RestController
@RequestMapping("/api/mpesa/test")
public class MpesaTestController {

    private final MpesaOAuthService mpesaOAuthService;

    public MpesaTestController(MpesaOAuthService mpesaOAuthService) {
        this.mpesaOAuthService = mpesaOAuthService;
    }

    @GetMapping("/oauth")
    public String testOAuth() {
        MpesaOAuthResponse response = mpesaOAuthService.getAccessToken();

        if (response == null || response.getAccessToken() == null) {
            return "OAuth failed";
        }

        return "M-Pesa OAuth successful";
    }
}
