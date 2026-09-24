package com.finpay.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.finpay.api.integrations.mpesa.config.MpesaProperties;

@SpringBootApplication
@EnableConfigurationProperties(MpesaProperties.class)
public class FinPayApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinPayApiApplication.class, args);
	}

}
