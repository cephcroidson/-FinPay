package com.finpay.api.otp;

public interface OtpDeliveryService {

    void sendOtp(
            String destination,
            OtpChannel channel,
            String otp
    );
}
