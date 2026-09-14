package com.finpay.mobile.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.finpay.mobile.data.model.AccountResponse
import com.finpay.mobile.data.model.TransactionResponse
import com.finpay.mobile.data.remote.LoginRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException

data class LoginUiState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val account: AccountResponse? = null,
    val transactions: List<TransactionResponse> = emptyList(),
    val isTransactionsLoading: Boolean = false,
    val transactionError: String? = null,
    val errorMessage: String? = null
)

class LoginViewModel(
    private val repository: LoginRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun login(email: String, password: String) {

        if (email.isBlank() || password.isBlank()) {
            _uiState.value = LoginUiState(
                errorMessage = "Email and password are required."
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = LoginUiState(
                isLoading = true
            )

            try {
                repository.login(email, password)

                val account = repository.getMyAccount()

                _uiState.value = LoginUiState(
                    isLoggedIn = true,
                    account = account
                )

            } catch (exception: HttpException) {
                _uiState.value = LoginUiState(
                    errorMessage = if (exception.code() == 401) {
                        "Invalid email or password."
                    } else {
                        "Server error. Please try again."
                    }
                )

            } catch (exception: IOException) {
                _uiState.value = LoginUiState(
                    errorMessage = "Unable to connect to FinPay. Check your connection."
                )

            } catch (exception: Exception) {
                _uiState.value = LoginUiState(
                    errorMessage = "Something went wrong. Please try again."
                )
            }
        }
    }

    fun loadTransactions(accountId: Long) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isTransactionsLoading = true,
                transactionError = null
            )

            try {
                val transactions = repository.getAccountTransactions(accountId)

                _uiState.value = _uiState.value.copy(
                    transactions = transactions,
                    isTransactionsLoading = false
                )

            } catch (exception: HttpException) {
                _uiState.value = _uiState.value.copy(
                    isTransactionsLoading = false,
                    transactionError = if (exception.code() == 401) {
                        "Session expired. Please sign in again."
                    } else {
                        "Unable to load transactions."
                    }
                )

            } catch (exception: IOException) {
                _uiState.value = _uiState.value.copy(
                    isTransactionsLoading = false,
                    transactionError = "Unable to connect to FinPay."
                )

            } catch (exception: Exception) {
                _uiState.value = _uiState.value.copy(
                    isTransactionsLoading = false,
                    transactionError = "Something went wrong while loading transactions."
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(
            errorMessage = null
        )
    }
}
