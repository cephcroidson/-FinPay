package com.finpay.api.otp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class DemoOtpDeliveryService implements OtpDeliveryService {

    private static final Logger log =
            LoggerFactory.getLogger(DemoOtpDeliveryService.class);

    @Override
    public void sendOtp(
            String destination,
            OtpChannel channel,
            String otp
    ) {
        /*
         * DEMO mode intentionally does not log or persist
         * the plaintext OTP.
         *
         * A real Email/SMS provider will be responsible
         * for delivering the code to the customer.
         */
        log.info(
                "DEMO OTP delivery requested: channel={}, destination={}",
                channel,
                maskDestination(destination)
        );
    }

    private String maskDestination(String destination) {
        if (destination == null || destination.length() < 4) {
            return "***";
        }

        int visibleCharacters = Math.min(3, destination.length());

        return destination.substring(0, visibleCharacters) + "***";
    }
}
