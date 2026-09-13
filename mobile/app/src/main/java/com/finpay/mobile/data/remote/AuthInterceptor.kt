package com.finpay.mobile.data.remote

import com.finpay.mobile.data.security.TokenStorage
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(
    private val tokenStorage: TokenStorage
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()

        val token = tokenStorage.getToken()

        if (token.isNullOrBlank()) {
            return chain.proceed(originalRequest)
        }

        val authenticatedRequest = originalRequest.newBuilder()
            .addHeader(
                "Authorization",
                "Bearer $token"
            )
            .build()

        return chain.proceed(authenticatedRequest)
    }
}
