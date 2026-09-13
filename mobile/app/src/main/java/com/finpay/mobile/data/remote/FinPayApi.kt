package com.finpay.mobile.data.remote

import com.finpay.mobile.data.model.LoginRequest
import com.finpay.mobile.data.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface FinPayApi {

    @POST("api/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse
}
