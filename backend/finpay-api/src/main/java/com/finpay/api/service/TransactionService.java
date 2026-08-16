package com.finpay.api.service;

import com.finpay.api.entity.Account;
import com.finpay.api.entity.Transaction;
import com.finpay.api.entity.TransactionStatus;
import com.finpay.api.entity.TransactionType;
import com.finpay.api.exception.AccountNotFoundException;
import com.finpay.api.exception.TransactionNotFoundException;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    // =========================================================
    // DEPOSIT
    // =========================================================

    @Transactional
    public Transaction deposit(
            Long accountId,
            BigDecimal amount,
            String description,
            String authenticatedEmail) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Deposit amount must be greater than zero");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException(accountId));

        // User must own the account
        verifyOwnership(account, authenticatedEmail);

        account.setBalance(
                account.getBalance().add(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAmount(amount);
        transaction.setCurrency(account.getCurrency());
        transaction.setDescription(description);
        transaction.setReference(generateReference());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setDestinationAccount(account);
        transaction.setCompletedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    // =========================================================
    // WITHDRAW
    // =========================================================

    @Transactional
    public Transaction withdraw(
            Long accountId,
            BigDecimal amount,
            String description,
            String authenticatedEmail) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Withdrawal amount must be greater than zero");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException(accountId));

        // User must own the account
        verifyOwnership(account, authenticatedEmail);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient account balance");
        }

        account.setBalance(
                account.getBalance().subtract(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAmount(amount);
        transaction.setCurrency(account.getCurrency());
        transaction.setDescription(description);
        transaction.setReference(generateReference());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setType(TransactionType.WITHDRAWAL);
        transaction.setSourceAccount(account);
        transaction.setCompletedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    // =========================================================
    // TRANSFER
    // =========================================================

    @Transactional
    public Transaction transfer(
            Long sourceAccountId,
            Long destinationAccountId,
            BigDecimal amount,
            String description,
            String authenticatedEmail) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Transfer amount must be greater than zero");
        }

        if (sourceAccountId.equals(destinationAccountId)) {
            throw new IllegalArgumentException(
                    "Source and destination accounts must be different");
        }

        Account sourceAccount = accountRepository.findById(sourceAccountId)
                .orElseThrow(() ->
                        new AccountNotFoundException(sourceAccountId));

        // User must own the account money is coming from
        verifyOwnership(sourceAccount, authenticatedEmail);

        Account destinationAccount = accountRepository.findById(
                destinationAccountId
        ).orElseThrow(() ->
                new AccountNotFoundException(destinationAccountId));

        if (!sourceAccount.getCurrency()
                .equals(destinationAccount.getCurrency())) {

            throw new IllegalArgumentException(
                    "Source and destination currencies must match");
        }

        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient account balance");
        }

        sourceAccount.setBalance(
                sourceAccount.getBalance().subtract(amount)
        );

        destinationAccount.setBalance(
                destinationAccount.getBalance().add(amount)
        );

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        Transaction transaction = new Transaction();

        transaction.setAmount(amount);
        transaction.setCurrency(sourceAccount.getCurrency());
        transaction.setDescription(description);
        transaction.setReference(generateReference());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setType(TransactionType.TRANSFER);
        transaction.setSourceAccount(sourceAccount);
        transaction.setDestinationAccount(destinationAccount);
        transaction.setCompletedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    // =========================================================
    // GET TRANSACTION BY REFERENCE
    // =========================================================

    @Transactional(readOnly = true)
    public Transaction getTransactionByReference(
            String reference,
            String authenticatedEmail) {

        Transaction transaction =
                transactionRepository.findByReference(reference)
                        .orElseThrow(() ->
                                new TransactionNotFoundException(reference));

        verifyTransactionAccess(
                transaction,
                authenticatedEmail
        );

        return transaction;
    }

    // =========================================================
    // GET ACCOUNT TRANSACTIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<Transaction> getAccountTransactions(
            Long accountId,
            String authenticatedEmail) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException(accountId));

        // User must own the account
        verifyOwnership(account, authenticatedEmail);

        return transactionRepository
                .findBySourceAccountIdOrDestinationAccountId(
                        accountId,
                        accountId
                );
    }

    // =========================================================
    // OWNERSHIP CHECK
    // =========================================================

    private void verifyOwnership(
            Account account,
            String authenticatedEmail) {

        if (!account.getUser()
                .getEmail()
                .equals(authenticatedEmail)) {

            // Return 404 instead of revealing another user's account
            throw new AccountNotFoundException(
                    account.getId()
            );
        }
    }

    // =========================================================
    // TRANSACTION ACCESS CHECK
    // =========================================================

    private void verifyTransactionAccess(
            Transaction transaction,
            String authenticatedEmail) {

        boolean hasAccess = false;

        if (transaction.getSourceAccount() != null) {

            hasAccess = transaction.getSourceAccount()
                    .getUser()
                    .getEmail()
                    .equals(authenticatedEmail);
        }

        if (!hasAccess && transaction.getDestinationAccount() != null) {

            hasAccess = transaction.getDestinationAccount()
                    .getUser()
                    .getEmail()
                    .equals(authenticatedEmail);
        }

        if (!hasAccess) {
            throw new TransactionNotFoundException(
                    transaction.getReference()
            );
        }
    }

    // =========================================================
    // TRANSACTION REFERENCE GENERATOR
    // =========================================================

    private String generateReference() {

        return "TXN-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 16)
                        .toUpperCase();
    }
}
