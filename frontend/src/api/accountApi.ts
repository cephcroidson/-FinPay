import apiRequest from "./apiClient";
import type { Account } from "../types/account";

export async function getMyAccount(): Promise<Account | null> {
    return apiRequest<Account>("/accounts/me");
}

export async function createMyAccount(): Promise<Account | null> {
    return apiRequest<Account>("/accounts/me", {
        method: "POST",
    });
}

export async function getAccount(
    accountId: number
): Promise<Account | null> {
    return apiRequest<Account>(`/accounts/${accountId}`);
}

/**
 * Explicit account creation endpoint.
 *
 * Kept for compatibility with the existing API contract.
 * Normal users should use createMyAccount() instead.
 */
export async function createAccount(
    userId: number
): Promise<Account | null> {
    return apiRequest<Account>("/accounts", {
        method: "POST",
        body: JSON.stringify({
            userId,
        }),
    });
}
