import apiRequest from "./apiClient";
import type {
    DepositRequest,
    Transaction,
    TransferRequest,
    WithdrawRequest,
} from "../types/transaction";

export async function deposit(
    accountId: number,
    amount: number,
    description?: string
): Promise<Transaction | null> {
    const payload: DepositRequest = {
        accountId,
        amount,
        description,
    };

    return apiRequest<Transaction>("/transactions/deposit", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function withdraw(
    accountId: number,
    amount: number,
    description?: string
): Promise<Transaction | null> {
    const payload: WithdrawRequest = {
        accountId,
        amount,
        description,
    };

    return apiRequest<Transaction>("/transactions/withdraw", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function transfer(
    sourceAccountId: number,
    destinationAccountId: number,
    amount: number,
    description?: string
): Promise<Transaction | null> {
    const payload: TransferRequest = {
        sourceAccountId,
        destinationAccountId,
        amount,
        description,
    };

    return apiRequest<Transaction>("/transactions/transfer", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getAccountTransactions(
    accountId: number
): Promise<Transaction[]> {
    return (
        (await apiRequest<Transaction[]>(
            `/transactions/account/${accountId}`
        )) ?? []
    );
}

export async function getTransactionByReference(
    reference: string
): Promise<Transaction | null> {
    return apiRequest<Transaction>(
        `/transactions/reference/${reference}`
    );
}
