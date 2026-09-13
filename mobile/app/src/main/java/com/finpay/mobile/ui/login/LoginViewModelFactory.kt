package com.finpay.mobile.ui.login

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.finpay.mobile.data.remote.LoginRepository
import com.finpay.mobile.data.remote.RetrofitClient
import com.finpay.mobile.data.security.TokenStorage

class LoginViewModelFactory(
    private val context: Context
) : ViewModelProvider.Factory {

    override fun <T : ViewModel> create(
        modelClass: Class<T>
    ): T {
        if (modelClass.isAssignableFrom(LoginViewModel::class.java)) {

            val applicationContext = context.applicationContext

            val tokenStorage = TokenStorage(
                applicationContext
            )

            val api = RetrofitClient.getApi(
                applicationContext
            )

            val repository = LoginRepository(
                api = api,
                tokenStorage = tokenStorage
            )

            @Suppress("UNCHECKED_CAST")
            return LoginViewModel(repository) as T
        }

        throw IllegalArgumentException(
            "Unknown ViewModel class: ${modelClass.name}"
        )
    }
}
