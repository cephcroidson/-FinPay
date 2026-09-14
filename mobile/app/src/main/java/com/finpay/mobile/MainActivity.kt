package com.finpay.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.finpay.mobile.ui.login.LoginViewModel
import com.finpay.mobile.ui.login.LoginViewModelFactory
import com.finpay.mobile.ui.theme.FinPayMobileTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            FinPayMobileTheme {
                FinPayApp(
                    viewModelFactory = LoginViewModelFactory(this)
                )
            }
        }
    }
}

@Composable
fun FinPayApp(
    viewModelFactory: LoginViewModelFactory
) {
    val loginViewModel: LoginViewModel = viewModel(
        factory = viewModelFactory
    )

    val uiState by loginViewModel.uiState.collectAsState()

    if (uiState.isLoggedIn && uiState.account != null) {
        FinPayDashboard(
            account = uiState.account!!,
            viewModel = loginViewModel
        )
    } else {
        FinPayLoginScreen(
            viewModel = loginViewModel
        )
    }
}

@Composable
fun FinPayLoginScreen(
    viewModel: LoginViewModel
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }

    val uiState by viewModel.uiState.collectAsState()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .widthIn(max = 500.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "FinPay",
                fontSize = 40.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Secure digital payments",
                fontSize = 16.sp,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(40.dp))

            OutlinedTextField(
                value = email,
                onValueChange = {
                    email = it
                    viewModel.clearError()
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                label = {
                    Text("Email")
                },
                placeholder = {
                    Text("Enter your email")
                },
                colors = OutlinedTextFieldDefaults.colors()
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = password,
                onValueChange = {
                    password = it
                    viewModel.clearError()
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                label = {
                    Text("Password")
                },
                placeholder = {
                    Text("Enter your password")
                },
                visualTransformation = if (passwordVisible) {
                    VisualTransformation.None
                } else {
                    PasswordVisualTransformation()
                },
                trailingIcon = {
                    TextButton(
                        onClick = {
                            passwordVisible = !passwordVisible
                        }
                    ) {
                        Text(
                            text = if (passwordVisible) "HIDE" else "SHOW",
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                },
                colors = OutlinedTextFieldDefaults.colors()
            )

            Spacer(modifier = Modifier.height(16.dp))

            uiState.errorMessage?.let { errorMessage ->
                Text(
                    text = errorMessage,
                    color = MaterialTheme.colorScheme.error,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))
            }

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = {
                    viewModel.login(
                        email = email.trim(),
                        password = password
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                enabled = !uiState.isLoading,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                )
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.height(22.dp),
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text(
                        text = "Sign In",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(
                onClick = {
                    // Registration flow will be added later.
                },
                enabled = !uiState.isLoading
            ) {
                Text(
                    text = "Don't have an account? Register"
                )
            }
        }
    }
}

@Composable
fun FinPayDashboard(
    account: com.finpay.mobile.data.model.AccountResponse,
    viewModel: LoginViewModel
) {
    LaunchedEffect(account.id) {
        viewModel.loadTransactions(account.id)
    }

    val uiState by viewModel.uiState.collectAsState()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp)
                .widthIn(max = 600.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                text = "FinPay",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Dashboard",
                fontSize = 18.sp,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(28.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Text(
                        text = "Available Balance",
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onPrimary
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "${account.currency} ${"%.2f".format(account.balance)}",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Account details",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            AccountDetailRow(
                label = "Account number",
                value = account.accountNumber
            )

            Spacer(modifier = Modifier.height(12.dp))

            AccountDetailRow(
                label = "Currency",
                value = account.currency
            )

            Spacer(modifier = Modifier.height(12.dp))

            AccountDetailRow(
                label = "Status",
                value = account.status
            )

            Spacer(modifier = Modifier.height(32.dp))

            Text(
                text = "Transaction History",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            when {
                uiState.isTransactionsLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )
                }

                uiState.transactionError != null -> {
                    Text(
                        text = uiState.transactionError!!,
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 14.sp
                    )
                }

                uiState.transactions.isEmpty() -> {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    ) {
                        Text(
                            text = "No transactions yet.",
                            modifier = Modifier.padding(16.dp),
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                else -> {
                    uiState.transactions.forEach { transaction ->
                        TransactionCard(transaction = transaction)

                        Spacer(modifier = Modifier.height(12.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun TransactionCard(
    transaction: com.finpay.mobile.data.model.TransactionResponse
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = transaction.type,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Text(
                    text = "${transaction.currency} ${"%.2f".format(transaction.amount)}",
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            transaction.description?.takeIf { it.isNotBlank() }?.let {
                Text(
                    text = it,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(6.dp))
            }

            Text(
                text = "Status: ${transaction.status}",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Reference: ${transaction.reference}",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun AccountDetailRow(
    label: String,
    value: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = label,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Text(
                text = value,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
