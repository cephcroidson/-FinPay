package com.finpay.api.integrations.mpesa.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.finpay.api.integrations.mpesa.config.MpesaProperties;
import com.finpay.api.integrations.mpesa.dto.MpesaOAuthResponse;

@Service
public class MpesaOAuthService {

    private final MpesaProperties mpesaProperties;
    private final RestClient restClient;

    public MpesaOAuthService(
            MpesaProperties mpesaProperties,
            RestClient.Builder restClientBuilder) {

        this.mpesaProperties = mpesaProperties;
        this.restClient = restClientBuilder
                .baseUrl(mpesaProperties.getBaseUrl())
                .build();
    }

    public MpesaOAuthResponse getAccessToken() {
        String credentials = mpesaProperties.getConsumerKey()
                + ":"
                + mpesaProperties.getConsumerSecret();

        String encodedCredentials = Base64.getEncoder()
                .encodeToString(
                        credentials.getBytes(StandardCharsets.UTF_8));

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/oauth/v1/generate")
                        .queryParam("grant_type", "client_credentials")
                        .build())
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Basic " + encodedCredentials)
                .retrieve()
                .body(MpesaOAuthResponse.class);
    }
}
