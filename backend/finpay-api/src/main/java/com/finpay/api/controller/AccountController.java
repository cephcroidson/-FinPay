package com.finpay.api.controller;

import com.finpay.api.dto.CreateAccountRequest;
import com.finpay.api.entity.Account;
import com.finpay.api.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(
            @RequestBody CreateAccountRequest request) {

        Account account = accountService.createAccount(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(account);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                accountService.getAccountById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Account> getAccountByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                accountService.getAccountByUserId(userId)
        );
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<Account> getAccountByNumber(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                accountService.getAccountByNumber(accountNumber)
        );
    }
}
