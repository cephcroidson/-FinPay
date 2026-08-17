import apiRequest from "./apiClient";

export async function deposit(accountId, amount, description) {
    return apiRequest("/transactions/deposit", {
        method: "POST",
        body: JSON.stringify({
            accountId,
            amount,
            description,
        }),
    });
}

export async function withdraw(accountId, amount, description) {
    return apiRequest("/transactions/withdraw", {
        method: "POST",
        body: JSON.stringify({
            accountId,
            amount,
            description,
        }),
    });
}

export async function transfer(
    sourceAccountId,
    destinationAccountId,
    amount,
    description
) {
    return apiRequest("/transactions/transfer", {
        method: "POST",
        body: JSON.stringify({
            sourceAccountId,
            destinationAccountId,
            amount,
            description,
        }),
    });
}

export async function getAccountTransactions(accountId) {
    return apiRequest(`/transactions/account/${accountId}`);
}

export async function getTransactionByReference(reference) {
    return apiRequest(`/transactions/reference/${reference}`);
}
