package com.finpay.api.service;

import com.finpay.api.dto.CreateAccountRequest;
import com.finpay.api.entity.Account;
import com.finpay.api.entity.User;
import com.finpay.api.exception.AccessDeniedException;
import com.finpay.api.exception.AccountNotFoundException;
import com.finpay.api.exception.DuplicateResourceException;
import com.finpay.api.exception.UserNotFoundException;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(
            AccountRepository accountRepository,
            UserRepository userRepository) {

        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Account createAccount(
            CreateAccountRequest request,
            String authenticatedEmail) {

        User requestedUser = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new UserNotFoundException(request.getUserId()));

        if (!requestedUser.getEmail().equals(authenticatedEmail)) {
            throw new AccessDeniedException(
                    "You are not authorized to create an account for this user"
            );
        }

        if (accountRepository
                .findByUserId(requestedUser.getId())
                .isPresent()) {

            throw new DuplicateResourceException(
                    "User already has an account"
            );
        }

        Account account = new Account();

        account.setUser(requestedUser);
        account.setAccountNumber(generateAccountNumber());

        return accountRepository.save(account);
    }
public Account getMyAccount(String authenticatedEmail) {

    User user = userRepository
            .findByEmail(authenticatedEmail)
            .orElseThrow(() ->
                    new UserNotFoundException(authenticatedEmail));

    return accountRepository
            .findByUserId(user.getId())
            .orElseThrow(() ->
                    new AccountNotFoundException(-1L));
}

    public Account getAccountById(
            Long id,
            String authenticatedEmail) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() ->
                        new AccountNotFoundException(id));

        verifyOwnership(account, authenticatedEmail);

        return account;
    }

    public Account getAccountByNumber(
            String accountNumber,
            String authenticatedEmail) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException(-1L));

        verifyOwnership(account, authenticatedEmail);

        return account;
    }

    private void verifyOwnership(
            Account account,
            String authenticatedEmail) {

        if (!account.getUser()
                .getEmail()
                .equals(authenticatedEmail)) {

            throw new AccessDeniedException(
                    "You are not authorized to access this account"
            );
        }
    }

    private String generateAccountNumber() {

        return "254"
                + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12);
    }
}
