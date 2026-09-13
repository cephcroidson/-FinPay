package com.finpay.mobile.data.remote

import com.finpay.mobile.data.model.LoginRequest
import com.finpay.mobile.data.model.LoginResponse
import com.finpay.mobile.data.security.TokenStorage

class LoginRepository(
    private val api: FinPayApi,
    private val tokenStorage: TokenStorage
) {

    suspend fun login(
        email: String,
        password: String
    ): LoginResponse {

        val response = api.login(
            LoginRequest(
                email = email,
                password = password
            )
        )

        tokenStorage.saveToken(response.token)

        return response
    }

    fun getToken(): String? {
        return tokenStorage.getToken()
    }

    fun clearToken() {
        tokenStorage.clearToken()
    }

    fun hasToken(): Boolean {
        return tokenStorage.hasToken()
    }
}
