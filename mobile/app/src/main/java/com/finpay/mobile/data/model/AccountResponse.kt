package com.finpay.mobile.data.model

data class AccountResponse(
    val id: Long,
    val accountNumber: String,
    val balance: Double,
    val currency: String,
    val status: String
)
