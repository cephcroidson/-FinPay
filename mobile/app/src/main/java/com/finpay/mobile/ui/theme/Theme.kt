package com.finpay.mobile.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val FinPayDarkColorScheme = darkColorScheme(
    primary = FinPayGold,
    onPrimary = FinPayNavy,
    secondary = FinPayGoldLight,
    onSecondary = FinPayNavy,
    background = FinPayNavy,
    onBackground = FinPayText,
    surface = FinPayNavyLight,
    onSurface = FinPayText,
    error = FinPayError,
    onError = FinPayWhite
)

private val FinPayLightColorScheme = lightColorScheme(
    primary = FinPayNavy,
    onPrimary = FinPayWhite,
    secondary = FinPayGold,
    onSecondary = FinPayNavy,
    background = FinPayWhite,
    onBackground = FinPayNavy,
    surface = FinPayWhite,
    onSurface = FinPayNavy,
    error = FinPayError,
    onError = FinPayWhite
)

@Composable
fun FinPayMobileTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        FinPayDarkColorScheme
    } else {
        FinPayLightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
