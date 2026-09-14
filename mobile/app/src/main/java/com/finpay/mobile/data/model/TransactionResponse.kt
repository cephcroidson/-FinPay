package com.finpay.mobile.data.model

data class TransactionResponse(
    val id: Long,
    val reference: String,
    val amount: Double,
    val currency: String,
    val description: String?,
    val type: String,
    val status: String,
    val createdAt: String,
    val completedAt: String?
)
