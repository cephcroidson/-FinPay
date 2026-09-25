package com.finpay.api.integrations.mpesa.controller;

import com.finpay.api.integrations.mpesa.dto.MpesaPaymentResponse;
import com.finpay.api.integrations.mpesa.dto.MpesaStkPushRequest;
import com.finpay.api.integrations.mpesa.service.MpesaStkPushService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mpesa")
public class MpesaController {

    private final MpesaStkPushService mpesaStkPushService;

    public MpesaController(
            MpesaStkPushService mpesaStkPushService) {
        this.mpesaStkPushService = mpesaStkPushService;
    }

    @PostMapping("/stk-push")
    public ResponseEntity<MpesaPaymentResponse> initiateStkPush(
            @Valid @RequestBody MpesaStkPushRequest request,
            Authentication authentication) {

        MpesaPaymentResponse response =
                mpesaStkPushService.initiateStkPush(
                        request,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}
