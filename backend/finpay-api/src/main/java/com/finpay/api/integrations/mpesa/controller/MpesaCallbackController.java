package com.finpay.api.integrations.mpesa.controller;

import com.finpay.api.integrations.mpesa.dto.MpesaCallbackRequest;
import com.finpay.api.integrations.mpesa.service.MpesaCallbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mpesa")
public class MpesaCallbackController {

    private final MpesaCallbackService mpesaCallbackService;

    public MpesaCallbackController(
            MpesaCallbackService mpesaCallbackService) {

        this.mpesaCallbackService = mpesaCallbackService;
    }

    @PostMapping("/callback")
    public ResponseEntity<Map<String, String>> handleCallback(
            @RequestBody MpesaCallbackRequest request) {

        mpesaCallbackService.processCallback(request);

        /*
         * M-Pesa expects a successful HTTP response after
         * receiving the callback.
         */
        return ResponseEntity.ok(
                Map.of(
                        "ResultCode", "0",
                        "ResultDesc", "Callback received successfully"
                )
        );
    }
}
