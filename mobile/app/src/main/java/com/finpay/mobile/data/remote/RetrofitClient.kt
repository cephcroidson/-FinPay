package com.finpay.mobile.data.remote

import android.content.Context
import com.finpay.mobile.data.security.TokenStorage
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    private const val BASE_URL = "http://127.0.0.1:8080/"

    @Volatile
    private var retrofit: Retrofit? = null

    fun getApi(context: Context): FinPayApi {
        return retrofit?.create(FinPayApi::class.java)
            ?: synchronized(this) {
                retrofit?.create(FinPayApi::class.java)
                    ?: createRetrofit(context.applicationContext)
                        .also { retrofit = it }
                        .create(FinPayApi::class.java)
            }
    }

    private fun createRetrofit(context: Context): Retrofit {

        val tokenStorage = TokenStorage(context)

        val httpClient = OkHttpClient.Builder()
            .addInterceptor(
                AuthInterceptor(tokenStorage)
            )
            .build()

        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(httpClient)
            .addConverterFactory(
                GsonConverterFactory.create()
            )
            .build()
    }
}
