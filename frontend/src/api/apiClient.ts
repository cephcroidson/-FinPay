import type { ApiError } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiRequestOptions extends RequestInit {
    headers?: HeadersInit;
}

async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T | null> {
    const token = localStorage.getItem("finpay_token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers
            ? Object.fromEntries(new Headers(options.headers).entries())
            : {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401 && token) {
            window.dispatchEvent(new Event("finpay:unauthorized"));
        }

        let errorMessage = `Request failed with status ${response.status}`;

        try {
            const errorData = await response.json();

            if (
                errorData &&
                typeof errorData.message === "string"
            ) {
                errorMessage = errorData.message;
            }
        } catch {
            // Response may not contain JSON
        }

        const error: ApiError = new Error(errorMessage) as ApiError;
        error.status = response.status;

        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json() as Promise<T>;
}

export default apiRequest;
