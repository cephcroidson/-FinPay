package com.finpay.api.service;

import com.finpay.api.dto.CreateAccountRequest;
import com.finpay.api.entity.Account;
import com.finpay.api.entity.User;
import com.finpay.api.exception.AccountNotFoundException;
import com.finpay.api.exception.DuplicateResourceException;
import com.finpay.api.exception.UserNotFoundException;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(
            AccountRepository accountRepository,
            UserRepository userRepository) {

        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Account createAccount(CreateAccountRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new UserNotFoundException(request.getUserId()));

        if (accountRepository.findByUserId(user.getId()).isPresent()) {
            throw new DuplicateResourceException(
                    "User already has an account");
        }

        Account account = new Account();

        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());

        return accountRepository.save(account);
    }

    public Account getAccountById(Long id) {

        return accountRepository.findById(id)
                .orElseThrow(() ->
                        new AccountNotFoundException(id));
    }

    public Account getAccountByUserId(Long userId) {

        return accountRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new AccountNotFoundException(userId));
    }

    public Account getAccountByNumber(String accountNumber) {

        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                -1L
                        ));
    }

    private String generateAccountNumber() {

        return "254"
                + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12);
    }
}
