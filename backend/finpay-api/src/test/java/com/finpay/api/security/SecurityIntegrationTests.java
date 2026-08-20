package com.finpay.api.security;

import com.finpay.api.entity.Account;
import com.finpay.api.entity.User;
import com.finpay.api.entity.UserStatus;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private User userA;
    private User userB;

    private Account accountA;
    private Account accountB;

    private String tokenA;

    @BeforeEach
    void setUp() {

        accountRepository.deleteAll();
        userRepository.deleteAll();

        userA = createUser(
                "usera@finpay.test",
                "254700000001"
        );

        userB = createUser(
                "userb@finpay.test",
                "254700000002"
        );

        accountA = createAccount(
                userA,
                "25470000000001",
                new BigDecimal("1000.00")
        );

        accountB = createAccount(
                userB,
                "25470000000002",
                new BigDecimal("1000.00")
        );

        tokenA = jwtService.generateToken(userA.getEmail());
    }

    @Test
    void protectedAccountEndpointWithoutTokenReturns401() throws Exception {

        mockMvc.perform(
                get("/api/accounts/me")
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedTransactionEndpointWithoutTokenReturns401() throws Exception {

        mockMvc.perform(
                get("/api/transactions/account/1")
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointWithInvalidTokenReturns401() throws Exception {

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer invalid.jwt.token"
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointWithMalformedTokenReturns401() throws Exception {

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer not-a-jwt"
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedUserCanAccessOwnAccount() throws Exception {

        mockMvc.perform(
                get("/api/accounts/" + accountA.getId())
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk());
    }

    @Test
    void authenticatedUserCannotAccessAnotherUsersAccount() throws Exception {

        mockMvc.perform(
                get("/api/accounts/" + accountB.getId())
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isForbidden());
    }

    @Test
    void authenticatedUserCannotAccessAnotherUsersAccountByNumber()
            throws Exception {

        mockMvc.perform(
                get("/api/accounts/number/" + accountB.getAccountNumber())
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isForbidden());
    }

    @Test
    void authenticatedUserCannotDepositIntoAnotherUsersAccount()
            throws Exception {

        String body = """
                {
                    "accountId": %d,
                    "amount": 100,
                    "description": "Unauthorized deposit"
                }
                """.formatted(accountB.getId());

        mockMvc.perform(
                post("/api/transactions/deposit")
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
        )
        .andExpect(status().isNotFound());
    }

    @Test
    void authenticatedUserCannotWithdrawFromAnotherUsersAccount()
            throws Exception {

        String body = """
                {
                    "accountId": %d,
                    "amount": 100,
                    "description": "Unauthorized withdrawal"
                }
                """.formatted(accountB.getId());

        mockMvc.perform(
                post("/api/transactions/withdraw")
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
        )
        .andExpect(status().isNotFound());
    }

    @Test
    void authenticatedUserCannotTransferFromAnotherUsersAccount()
            throws Exception {

        String body = """
                {
                    "sourceAccountId": %d,
                    "destinationAccountId": %d,
                    "amount": 100,
                    "description": "Unauthorized transfer"
                }
                """.formatted(
                accountB.getId(),
                accountA.getId()
        );

        mockMvc.perform(
                post("/api/transactions/transfer")
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
        )
        .andExpect(status().isNotFound());
    }

    @Test
    void authenticatedUserCannotReadAnotherUsersTransactionHistory()
            throws Exception {

        mockMvc.perform(
                get("/api/transactions/account/" + accountB.getId())
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isNotFound());
    }

    private User createUser(
            String email,
            String phoneNumber) {

        User user = new User();

        user.setFirstName("Security");
        user.setLastName("Test");
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setPassword(
                passwordEncoder.encode("TestPassword123!")
        );
        user.setStatus(UserStatus.ACTIVE);

        return userRepository.save(user);
    }

    private Account createAccount(
            User user,
            String accountNumber,
            BigDecimal balance) {

        Account account = new Account();

        account.setUser(user);
        account.setAccountNumber(accountNumber);
        account.setBalance(balance);
        account.setCurrency("KES");

        return accountRepository.save(account);
    }
}
