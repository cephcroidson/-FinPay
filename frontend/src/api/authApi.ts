import apiRequest from "./apiClient";
import type { AuthResponse, LoginRequest } from "../types/auth";

export interface RegisterUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface RegistrationResponse {
    message: string;
    publicId: string;
    email: string;
    onboardingStatus: string;
}

export interface VerifyEmailResponse {
    message: string;
    nextStep: "SET_PASSWORD";
    setupToken: string;
    expiresInMinutes: number;
}

export interface SetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface SetPasswordResponse {
    message: string;
    accountNumber: string;
    currency: string;
    balance: number;
    nextStep: "SET_TRANSACTION_PIN";
    setupToken: string;
    expiresInMinutes: number;
}

export interface SetPinRequest {
    token: string;
    pin: string;
    confirmPin: string;
}

export interface SetPinResponse {
    message: string;
    onboardingStatus: "ACTIVE";
}

export async function login(
    email: string,
    password: string
): Promise<AuthResponse | null> {
    const payload: LoginRequest = { email, password };

    return apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: false,
    });
}

export async function register(
    userData: RegisterUserRequest
): Promise<RegistrationResponse | null> {
    return apiRequest<RegistrationResponse>("/onboarding/register", {
        method: "POST",
        body: JSON.stringify(userData),
        auth: false,
    });
}

export async function verifyEmail(
    email: string,
    otp: string
): Promise<VerifyEmailResponse | null> {
    return apiRequest<VerifyEmailResponse>("/onboarding/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        auth: false,
    });
}

export async function setPassword(
    payload: SetPasswordRequest
): Promise<SetPasswordResponse | null> {
    return apiRequest<SetPasswordResponse>("/onboarding/set-password", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: false,
    });
}

export async function setTransactionPin(
    payload: SetPinRequest
): Promise<SetPinResponse | null> {
    return apiRequest<SetPinResponse>("/onboarding/set-pin", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: false,
    });
}
