package com.finpay.mobile.data.security

import android.content.Context
import android.util.Base64
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class TokenStorage(
    context: Context
) {

    companion object {
        private const val KEYSTORE_PROVIDER = "AndroidKeyStore"
        private const val KEY_ALIAS = "FinPayJwtKey"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val PREFS_NAME = "finpay_secure_storage"
        private const val TOKEN_KEY = "jwt_token"
        private const val IV_KEY = "jwt_iv"
    }

    private val preferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val keyStore =
        KeyStore.getInstance(KEYSTORE_PROVIDER).apply {
            load(null)
        }

    private fun getOrCreateKey(): SecretKey {
        val existingKey = keyStore.getKey(KEY_ALIAS, null)

        if (existingKey is SecretKey) {
            return existingKey
        }

        val keyGenerator = KeyGenerator.getInstance(
            "AES",
            KEYSTORE_PROVIDER
        )

        keyGenerator.init(
            android.security.keystore.KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                android.security.keystore.KeyProperties.PURPOSE_ENCRYPT or
                    android.security.keystore.KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(
                    android.security.keystore.KeyProperties.BLOCK_MODE_GCM
                )
                .setEncryptionPaddings(
                    android.security.keystore.KeyProperties.ENCRYPTION_PADDING_NONE
                )
                .build()
        )

        return keyGenerator.generateKey()
    }

    fun saveToken(token: String) {
        val cipher = Cipher.getInstance(TRANSFORMATION)

        cipher.init(
            Cipher.ENCRYPT_MODE,
            getOrCreateKey()
        )

        val encryptedToken = cipher.doFinal(
            token.toByteArray(StandardCharsets.UTF_8)
        )

        val encodedToken = Base64.encodeToString(
            encryptedToken,
            Base64.NO_WRAP
        )

        val encodedIv = Base64.encodeToString(
            cipher.iv,
            Base64.NO_WRAP
        )

        preferences.edit()
            .putString(TOKEN_KEY, encodedToken)
            .putString(IV_KEY, encodedIv)
            .apply()
    }

    fun getToken(): String? {
        val encodedToken = preferences.getString(TOKEN_KEY, null)
            ?: return null

        val encodedIv = preferences.getString(IV_KEY, null)
            ?: return null

        return try {
            val encryptedToken = Base64.decode(
                encodedToken,
                Base64.NO_WRAP
            )

            val iv = Base64.decode(
                encodedIv,
                Base64.NO_WRAP
            )

            val cipher = Cipher.getInstance(TRANSFORMATION)

            cipher.init(
                Cipher.DECRYPT_MODE,
                getOrCreateKey(),
                GCMParameterSpec(128, iv)
            )

            String(
                cipher.doFinal(encryptedToken),
                StandardCharsets.UTF_8
            )
        } catch (exception: Exception) {
            clearToken()
            null
        }
    }

    fun clearToken() {
        preferences.edit()
            .remove(TOKEN_KEY)
            .remove(IV_KEY)
            .apply()
    } 
fun hasToken(): Boolean {
    return getToken() != null
}
}
