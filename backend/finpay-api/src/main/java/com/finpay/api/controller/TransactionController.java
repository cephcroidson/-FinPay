package com.finpay.api.controller;
import com.finpay.api.dto.TransferRequest;
import com.finpay.api.dto.DepositRequest;
import com.finpay.api.dto.TransactionResponse;
import com.finpay.api.dto.WithdrawRequest;
import com.finpay.api.entity.Transaction;
import com.finpay.api.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestBody DepositRequest request) {

        Transaction transaction = transactionService.deposit(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new TransactionResponse(transaction));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @RequestBody WithdrawRequest request) {

        Transaction transaction = transactionService.withdraw(
                request.getAccountId(),
                request.getAmount(),
                request.getDescription()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new TransactionResponse(transaction));
    }
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @RequestBody TransferRequest request) {

        Transaction transaction = transactionService.transfer(
                request.getSourceAccountId(),
                request.getDestinationAccountId(),
                request.getAmount(),
                request.getDescription()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new TransactionResponse(transaction));
    }
          @GetMapping("/reference/{reference}")
public ResponseEntity<TransactionResponse> getTransactionByReference(
        @PathVariable String reference) {

    Transaction transaction =
            transactionService.getTransactionByReference(reference);

    return ResponseEntity.ok(
            new TransactionResponse(transaction)
    );
}
@GetMapping("/account/{accountId}")
public ResponseEntity<List<TransactionResponse>> getTransactionsByAccount(
        @PathVariable Long accountId) {

    List<Transaction> transactions =
            transactionService.getTransactionsByAccount(accountId);

    List<TransactionResponse> response = transactions.stream()
            .map(TransactionResponse::new)
            .toList();

    return ResponseEntity.ok(response);
}
}
