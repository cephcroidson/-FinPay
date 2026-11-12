export type TransactionType =
    | "DEPOSIT"
    | "WITHDRAW"
    | "TRANSFER";

export type TransactionStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | string;

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: number;
    description?: string | null;
    status: TransactionStatus;
    currency?: string;
    reference?: string;
    createdAt: string;
    completedAt?: string | null;
}

export interface DepositRequest {
    accountId: number;
    amount: number;
    description?: string;
}

export interface WithdrawRequest {
    accountId: number;
    amount: number;
    description?: string;
}

export interface TransferRequest {
    sourceAccountId: number;
    destinationAccountNumber: string;
    amount: number;
    description?: string;
}
