package com.finpay.mobile.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
            _uiState.value = LoginUiState(isLoading = true)

            try {
                repository.login(email, password)

                _uiState.value = LoginUiState(
                    isLoggedIn = true
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

    fun clearError() {
        _uiState.value = _uiState.value.copy(
            errorMessage = null
        )
    }
}
