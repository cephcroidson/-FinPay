package com.finpay.api.controller;
import jakarta.validation.Valid;
import com.finpay.api.dto.CreateAccountRequest;
import com.finpay.api.entity.Account;
import com.finpay.api.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
            @Valid @RequestBody CreateAccountRequest request,
            Authentication authentication) {

        Account account = accountService.createAccount(
                request,
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(account);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                accountService.getAccountById(
                        id,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<Account> getAccountByNumber(
            @PathVariable String accountNumber,
            Authentication authentication) {

        return ResponseEntity.ok(
                accountService.getAccountByNumber(
                        accountNumber,
                        authentication.getName()
                )
        );
    }
}
