package com.finpay.api.controller;

import com.finpay.api.dto.DepositRequest;
import com.finpay.api.dto.TransactionResponse;
import com.finpay.api.dto.TransferRequest;
import com.finpay.api.dto.WithdrawRequest;
import com.finpay.api.entity.Transaction;
import com.finpay.api.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @RequestBody DepositRequest request,
            Authentication authentication) {

        Transaction transaction = transactionService.deposit(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription(),
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new TransactionResponse(transaction));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @RequestBody WithdrawRequest request,
            Authentication authentication) {

        Transaction transaction = transactionService.withdraw(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription(),
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new TransactionResponse(transaction));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @RequestBody TransferRequest request,
            Authentication authentication) {

        Transaction transaction = transactionService.transfer(
                request.getSourceAccountId(),
                request.getDestinationAccountId(),
                request.getAmount(),
                request.getDescription(),
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new TransactionResponse(transaction));
    }

    @GetMapping("/reference/{reference}")
    public ResponseEntity<TransactionResponse> getTransactionByReference(
            @PathVariable String reference,
            Authentication authentication) {

        Transaction transaction =
                transactionService.getTransactionByReference(
                        reference,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                new TransactionResponse(transaction)
        );
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionResponse>> getAccountTransactions(
            @PathVariable Long accountId,
            Authentication authentication) {

        List<TransactionResponse> transactions =
                transactionService.getAccountTransactions(
                        accountId,
                        authentication.getName()
                )
                .stream()
                .map(TransactionResponse::new)
                .toList();

        return ResponseEntity.ok(transactions);
    }
}

