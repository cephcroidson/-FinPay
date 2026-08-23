package com.finpay.api.security;

import com.finpay.api.entity.Account;
import com.finpay.api.entity.User;
import com.finpay.api.entity.UserStatus;
import com.finpay.api.repository.AccountRepository;
import com.finpay.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
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

    @Value("${jwt.secret}")
    private String jwtSecret;

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
    void unsupportedAuthorizationSchemeCannotAccessProtectedEndpoint()
            throws Exception {

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Basic dXNlcjpwYXNz"
                        )
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
    void inactiveUserCannotAccessProtectedEndpointWithExistingToken()
            throws Exception {

        String inactiveToken =
                jwtService.generateToken(userA.getEmail());

        userA.setStatus(UserStatus.SUSPENDED);
        userRepository.save(userA);

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer " + inactiveToken
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void expiredJwtCannotAccessProtectedEndpoint() throws Exception {

        SecretKey key = Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );

        Date now = new Date();

        String expiredToken = Jwts.builder()
                .subject(userA.getEmail())
                .issuedAt(new Date(now.getTime() - 120000))
                .expiration(new Date(now.getTime() - 60000))
                .signWith(key)
                .compact();

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer " + expiredToken
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void jwtSignedWithWrongSecretCannotAccessProtectedEndpoint()
            throws Exception {

        SecretKey wrongKey = Keys.hmacShaKeyFor(
                "ThisIsACompletelyDifferentTestSecretKey1234567890"
                        .getBytes(StandardCharsets.UTF_8)
        );

        String tokenWithWrongSignature = Jwts.builder()
                .subject(userA.getEmail())
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis() + 3600000
                        )
                )
                .signWith(wrongKey)
                .compact();

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer " + tokenWithWrongSignature
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }
@Test
void jwtForNonexistentUserCannotAccessProtectedEndpoint()
        throws Exception {

    String tokenForNonexistentUser =
            jwtService.generateToken("nonexistent@finpay.test");

    mockMvc.perform(
            get("/api/accounts/me")
                    .header(
                            "Authorization",
                            "Bearer " + tokenForNonexistentUser
                    )
                    .accept(MediaType.APPLICATION_JSON)
    )
    .andExpect(status().isUnauthorized());
}


    @Test
    void jwtWithoutSubjectCannotAccessProtectedEndpoint()
            throws Exception {

        SecretKey key = Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );

        String tokenWithoutSubject = Jwts.builder()
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis() + 3600000
                        )
                )
                .signWith(key)
                .compact();

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer " + tokenWithoutSubject
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void emptyBearerTokenCannotAccessProtectedEndpoint()
            throws Exception {

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer "
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

    @Test
    void protectedEndpointReturnsSecurityHeaders() throws Exception {

        mockMvc.perform(
                get("/api/accounts/me")
                        .header(
                                "Authorization",
                                "Bearer " + tokenA
                        )
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk())
        .andExpect(header().string(
                "X-Content-Type-Options",
                "nosniff"
        ))
        .andExpect(header().string(
                "X-Frame-Options",
                "DENY"
        ))
        .andExpect(header().string(
                "Content-Security-Policy",
                containsString("default-src 'none'")
        ))
        .andExpect(header().string(
                "Referrer-Policy",
                "no-referrer"
        ));
    }

}
