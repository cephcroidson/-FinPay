package com.finpay.mobile.data.remote

import com.finpay.mobile.data.model.AccountResponse
import com.finpay.mobile.data.model.LoginRequest
import com.finpay.mobile.data.model.LoginResponse
import com.finpay.mobile.data.model.TransactionResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface FinPayApi {

    @POST("api/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @GET("api/accounts/me")
    suspend fun getMyAccount(): AccountResponse

    @GET("api/transactions/account/{accountId}")
    suspend fun getAccountTransactions(
        @Path("accountId") accountId: Long
    ): List<TransactionResponse>
}
