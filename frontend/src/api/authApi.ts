import apiRequest from "./apiClient";
import type {
    AuthResponse,
    LoginRequest,
} from "../types/auth";
import type { RegisterUserRequest } from "../types/user";

export async function login(
    email: string,
    password: string
): Promise<AuthResponse | null> {
    const payload: LoginRequest = {
        email,
        password,
    };

    return apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function register(
    userData: RegisterUserRequest
): Promise<unknown | null> {
    return apiRequest<unknown>("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}
