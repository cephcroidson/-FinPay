import apiRequest from "./apiClient";

export async function getMyAccount() {
    return apiRequest("/accounts/me");
}

export async function getAccount(accountId) {
    return apiRequest(`/accounts/${accountId}`);
}

export async function createAccount(userId) {
    return apiRequest("/accounts", {
        method: "POST",
        body: JSON.stringify({
            userId,
        }),
    });
}
