package com.finpay.api.service;

import com.finpay.api.entity.Account;

public record PasswordSetupResult(
        Account account,
        String pinSetupToken
) {}
