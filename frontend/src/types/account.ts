export type AccountStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "CLOSED"
    | string;

export interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    currency: string;
    status: AccountStatus;
}
