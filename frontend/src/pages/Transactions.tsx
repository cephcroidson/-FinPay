import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    FileText,
    LoaderCircle,
    Send,
    Wallet,
    XCircle,
} from "lucide-react";
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    deposit,
    getAccountTransactions,
    transfer,
    withdraw,
} from "../api/transactionApi";

import { getMyAccount } from "../api/accountApi";

import type { Account } from "../types/account";

import type {
    Transaction,
    TransactionType,
} from "../types/transaction";

interface TransactionForm {
    type: TransactionType;
    amount: string;
    destinationAccountId: string;
    description: string;
}

function Transactions() {
    const [account, setAccount] =
        useState<Account | null>(null);

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [submitting, setSubmitting] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string>("");

    const [success, setSuccess] =
        useState<string>("");

    const [form, setForm] =
        useState<TransactionForm>({
            type: "DEPOSIT",
            amount: "",
            destinationAccountId: "",
            description: "",
        });

    async function loadTransactions(
        accountId: number
    ): Promise<void> {
        const data =
            await getAccountTransactions(accountId);

        setTransactions(data);
    }

    useEffect(() => {
        async function initialize(): Promise<void> {
            try {
                setLoading(true);
                setError("");

                const accountData =
                    await getMyAccount();

                if (!accountData) {
                    setError(
                        "No account information is available."
                    );
                    return;
                }

                setAccount(accountData);

                await loadTransactions(
                    accountData.id
                );
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to load transaction data.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }

        initialize();
    }, []);

    function handleChange(
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ): void {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!account) {
            setError(
                "Account information is unavailable."
            );
            return;
        }

        const amount =
            Number(form.amount);

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            setError(
                "Enter a valid amount greater than zero."
            );
            return;
        }

        if (
            form.type === "TRANSFER" &&
            !form.destinationAccountId.trim()
        ) {
            setError(
                "Enter the destination account ID."
            );
            return;
        }

        if (
            form.type === "TRANSFER" &&
            Number(form.destinationAccountId) ===
                account.id
        ) {
            setError(
                "The destination account cannot be the same as the source account."
            );
            return;
        }

        try {
            setSubmitting(true);

            if (form.type === "DEPOSIT") {
                await deposit(
                    account.id,
                    amount,
                    form.description.trim() ||
                        undefined
                );
            }

            if (form.type === "WITHDRAW") {
                await withdraw(
                    account.id,
                    amount,
                    form.description.trim() ||
                        undefined
                );
            }

            if (form.type === "TRANSFER") {
                await transfer(
                    account.id,
                    Number(
                        form.destinationAccountId
                    ),
                    amount,
                    form.description.trim() ||
                        undefined
                );
            }

            setSuccess(
                `${form.type} completed successfully.`
            );

            setForm({
                type: form.type,
                amount: "",
                destinationAccountId: "",
                description: "",
            });

            const updatedAccount =
                await getMyAccount();

            if (updatedAccount) {
                setAccount(updatedAccount);

                await loadTransactions(
                    updatedAccount.id
                );
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Transaction could not be completed.";

            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    function formatAmount(
        amount: number
    ): string {
        return Number(amount).toLocaleString(
            "en-KE",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    }

    function getTransactionIcon(
        type: TransactionType
    ) {
        if (type === "DEPOSIT") {
            return ArrowDownLeft;
        }

        if (type === "WITHDRAW") {
            return ArrowUpRight;
        }

        return ArrowLeftRight;
    }

    function getTransactionIconStyle(
        type: TransactionType
    ): string {
        if (type === "DEPOSIT") {
            return "bg-emerald-500/10 text-emerald-500";
        }

        if (type === "WITHDRAW") {
            return "bg-amber-500/10 text-amber-500";
        }

        return "bg-blue-500/10 text-blue-500";
    }

    function getStatusIcon(
        status: string
    ) {
        const normalized =
            status.toUpperCase();

        if (
            normalized === "COMPLETED" ||
            normalized === "SUCCESS"
        ) {
            return CheckCircle2;
        }

        if (
            normalized === "FAILED" ||
            normalized === "CANCELLED"
        ) {
            return XCircle;
        }

        return Clock3;
    }

    function getStatusStyle(
        status: string
    ): string {
        const normalized =
            status.toUpperCase();

        if (
            normalized === "COMPLETED" ||
            normalized === "SUCCESS"
        ) {
            return "bg-emerald-500/10 text-emerald-500";
        }

        if (
            normalized === "FAILED" ||
            normalized === "CANCELLED"
        ) {
            return "bg-red-500/10 text-red-500";
        }

        return "bg-amber-500/10 text-amber-500";
    }

    if (loading) {
        return (
            <div className="space-y-7">
                <div className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-9 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-80 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>
        );
    }

    if (error && !account) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                    <XCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-red-500"
                    />

                    <div>
                        <h2 className="font-semibold text-red-900 dark:text-red-200">
                            Unable to load transactions
                        </h2>

                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#0a1626]">
                <Wallet
                    size={28}
                    className="mx-auto text-slate-400"
                />

                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                    No account found
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    A FinPay account is required to make
                    transactions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-7">
            {/* Header */}
            <section>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b8941f] dark:text-[#d4af37]">
                    Payments
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                    Transactions
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Deposit, withdraw, or transfer funds
                    securely through FinPay.
                </p>
            </section>

            {/* Account summary */}
            <section className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800/80 dark:bg-[#0a1626]">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10">
                        <Wallet
                            size={21}
                            className="text-[#b8941f] dark:text-[#d4af37]"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Available balance
                        </p>

                        <p className="mt-0.5 text-xl font-bold text-slate-950 dark:text-white">
                            {account.currency}{" "}
                            {formatAmount(
                                Number(
                                    account.balance
                                )
                            )}
                        </p>
                    </div>
                </div>

                <div className="sm:text-right">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Source account
                    </p>

                    <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">
                        {account.accountNumber}
                    </p>
                </div>
            </section>

            {/* Transaction workspace */}
            <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                {/* Transaction form */}
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-[#0a1626]">
                    <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10">
                                <Send
                                    size={18}
                                    className="text-[#b8941f] dark:text-[#d4af37]"
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-950 dark:text-white">
                                    New transaction
                                </h2>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Choose an operation to
                                    continue
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 p-6"
                    >
                        {/* Transaction type */}
                        <div>
                            <label
                                htmlFor="type"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                            >
                                Transaction type
                            </label>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    {
                                        value: "DEPOSIT" as const,
                                        label: "Deposit",
                                        icon: ArrowDownLeft,
                                    },
                                    {
                                        value: "WITHDRAW" as const,
                                        label: "Withdraw",
                                        icon: ArrowUpRight,
                                    },
                                    {
                                        value: "TRANSFER" as const,
                                        label: "Transfer",
                                        icon: ArrowLeftRight,
                                    },
                                ].map(
                                    (option) => {
                                        const Icon =
                                            option.icon;

                                        const active =
                                            form.type ===
                                            option.value;

                                        return (
                                            <button
                                                key={
                                                    option.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setForm(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            type: option.value,
                                                            destinationAccountId:
                                                                option.value ===
                                                                "TRANSFER"
                                                                    ? previous.destinationAccountId
                                                                    : "",
                                                        })
                                                    )
                                                }
                                                className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                                                    active
                                                        ? "border-[#d4af37]/50 bg-[#d4af37]/10 text-[#a47f0b] dark:border-[#d4af37]/40 dark:bg-[#d4af37]/10 dark:text-[#e5c45a]"
                                                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60"
                                                }`}
                                            >
                                                <Icon
                                                    size={18}
                                                />

                                                {
                                                    option.label
                                                }
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="sr-only"
                                aria-hidden="true"
                            >
                                <option value="DEPOSIT">
                                    Deposit
                                </option>

                                <option value="WITHDRAW">
                                    Withdrawal
                                </option>

                                <option value="TRANSFER">
                                    Transfer
                                </option>
                            </select>
                        </div>

                        {/* Destination */}
                        {form.type ===
                            "TRANSFER" && (
                            <div>
                                <label
                                    htmlFor="destinationAccountId"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                                >
                                    Destination account ID
                                </label>

                                <div className="relative">
                                    <ArrowLeftRight
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="destinationAccountId"
                                        name="destinationAccountId"
                                        type="number"
                                        min="1"
                                        value={
                                            form.destinationAccountId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter destination account ID"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:focus:border-[#d4af37]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Amount */}
                        <div>
                            <label
                                htmlFor="amount"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                            >
                                Amount
                            </label>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#b8941f] dark:text-[#d4af37]">
                                    {account.currency}
                                </span>

                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={
                                        form.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-14 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-[#d4af37]"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                            >
                                Description
                            </label>

                            <div className="relative">
                                <FileText
                                    size={17}
                                    className="absolute left-3 top-3 text-slate-400"
                                />

                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Optional transaction description"
                                    maxLength={120}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:focus:border-[#d4af37]"
                                />
                            </div>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                                <XCircle
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                                <CheckCircle2
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {success}
                                </span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-4 py-3.5 text-sm font-bold text-[#07111f] shadow-lg shadow-[#d4af37]/10 transition hover:bg-[#e1bd4b] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Send
                                        size={17}
                                    />
                                    Submit{" "}
                                    {form.type}
                                </>
                            )}
                        </button>

                        <p className="text-center text-[11px] leading-5 text-slate-400">
                            Transactions are submitted through
                            the authenticated FinPay API.
                        </p>
                    </form>
                </div>

                {/* Recent activity */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-[#0a1626]">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Activity
                            </p>

                            <h2 className="mt-1 font-semibold text-slate-950 dark:text-white">
                                Transaction history
                            </h2>
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {transactions.length}{" "}
                            records
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="flex min-h-[390px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <ArrowLeftRight
                                    size={23}
                                    className="text-slate-400"
                                />
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                                No transactions yet
                            </h3>

                            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Completed payment activity
                                will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map(
                                (transaction) => {
                                    const TransactionIcon =
                                        getTransactionIcon(
                                            transaction.type
                                        );

                                    const StatusIcon =
                                        getStatusIcon(
                                            String(
                                                transaction.status
                                            )
                                        );

                                    const isDeposit =
                                        transaction.type ===
                                        "DEPOSIT";

                                    return (
                                        <div
                                            key={
                                                transaction.id
                                            }
                                            className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                        >
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getTransactionIconStyle(
                                                    transaction.type
                                                )}`}
                                            >
                                                <TransactionIcon
                                                    size={19}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                        {
                                                            transaction.type
                                                        }
                                                    </p>

                                                    <span
                                                        className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:inline-flex ${getStatusStyle(
                                                            String(
                                                                transaction.status
                                                            )
                                                        )}`}
                                                    >
                                                        <StatusIcon
                                                            size={
                                                                11
                                                            }
                                                        />

                                                        {
                                                            transaction.status
                                                        }
                                                    </span>
                                                </div>

                                                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                                    {
                                                        transaction.description ||
                                                        "Payment transaction"
                                                    }
                                                </p>

                                                <span
                                                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:hidden ${getStatusStyle(
                                                        String(
                                                            transaction.status
                                                        )
                                                    )}`}
                                                >
                                                    <StatusIcon
                                                        size={
                                                            11
                                                        }
                                                    />

                                                    {
                                                        transaction.status
                                                    }
                                                </span>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p
                                                    className={`text-sm font-bold ${
                                                        isDeposit
                                                            ? "text-emerald-500"
                                                            : "text-slate-900 dark:text-white"
                                                    }`}
                                                >
                                                    {isDeposit
                                                        ? "+"
                                                        : "-"}{" "}
                                                    {
                                                        account.currency
                                                    }{" "}
                                                    {formatAmount(
                                                        Number(
                                                            transaction.amount
                                                        )
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                                                    ID #
                                                    {
                                                        transaction.id
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Transactions;
