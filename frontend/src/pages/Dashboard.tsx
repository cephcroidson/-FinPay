import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowLeftRight,
    CheckCircle2,
    CreditCard,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";
import {
    Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMyAccount } from "../api/accountApi";
import {
    getAccountTransactions,
} from "../api/transactionApi";

import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";

function Dashboard() {
    const { userEmail } = useAuth();

    const [account, setAccount] =
        useState<Account | null>(null);

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>("");

    useEffect(() => {
        async function loadDashboard(): Promise<void> {
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

                const transactionData =
                    await getAccountTransactions(
                        accountData.id
                    );

                setTransactions(
                    transactionData.slice(0, 5)
                );
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to load dashboard.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

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
        type: Transaction["type"]
    ) {
        if (type === "DEPOSIT") {
            return ArrowDownLeft;
        }

        if (type === "WITHDRAW") {
            return ArrowUpRight;
        }

        return ArrowLeftRight;
    }

    function getTransactionStyle(
        type: Transaction["type"]
    ): string {
        if (type === "DEPOSIT") {
            return "bg-emerald-500/10 text-emerald-500";
        }

        if (type === "WITHDRAW") {
            return "bg-amber-500/10 text-amber-500";
        }

        return "bg-blue-500/10 text-blue-500";
    }

    function getAmountPrefix(
        type: Transaction["type"]
    ): string {
        return type === "DEPOSIT"
            ? "+"
            : "-";
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={20} />

                    <div>
                        <h2 className="font-semibold">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-1 text-sm opacity-80">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-7">
            {/* Page heading */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b8941f] dark:text-[#d4af37]">
                        Overview
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                        Welcome back
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Here's your FinPay financial
                        overview.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                        <ShieldCheck
                            size={16}
                            className="text-emerald-500"
                        />
                    </div>

                    <span>
                        Secure session
                    </span>
                </div>
            </section>

            {/* Balance + account information */}
            <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                <div className="relative overflow-hidden rounded-3xl bg-[#0b1b2e] p-7 text-white shadow-xl shadow-slate-950/10 sm:p-8">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-2xl" />

                    <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Available balance
                                </p>

                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-sm font-semibold text-[#d4af37]">
                                        {account?.currency ||
                                            "KES"}
                                    </span>

                                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                        {formatAmount(
                                            Number(
                                                account?.balance ||
                                                    0
                                            )
                                        )}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                <Wallet
                                    size={21}
                                    className="text-[#d4af37]"
                                />
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                                    Account number
                                </p>

                                <p className="mt-1 font-mono text-sm tracking-wider text-slate-300">
                                    {account?.accountNumber}
                                </p>
                            </div>

                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                {account?.status ||
                                    "ACTIVE"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0a1626]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10">
                            <CreditCard
                                size={19}
                                className="text-[#b8941f] dark:text-[#d4af37]"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-950 dark:text-white">
                                Account details
                            </h2>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Your FinPay account
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                        <div className="flex items-center justify-between py-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Account ID
                            </span>

                            <span className="font-semibold text-slate-900 dark:text-white">
                                #{account?.id}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Currency
                            </span>

                            <span className="font-semibold text-slate-900 dark:text-white">
                                {account?.currency}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Status
                            </span>

                            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500">
                                <CheckCircle2
                                    size={15}
                                />
                                {account?.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                User
                            </span>

                            <span className="max-w-[55%] truncate text-sm font-medium text-slate-900 dark:text-white">
                                {userEmail}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick actions */}
            <section>
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Quick actions
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <Link
                        to="/transactions"
                        className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800/80 dark:bg-[#0a1626] dark:hover:border-[#d4af37]/40"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition group-hover:scale-105">
                            <ArrowDownLeft
                                size={20}
                            />
                        </div>

                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                Deposit
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Add funds
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/transactions"
                        className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800/80 dark:bg-[#0a1626] dark:hover:border-[#d4af37]/40"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition group-hover:scale-105">
                            <ArrowUpRight
                                size={20}
                            />
                        </div>

                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                Withdraw
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Take out funds
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/transactions"
                        className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800/80 dark:bg-[#0a1626] dark:hover:border-[#d4af37]/40"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition group-hover:scale-105">
                            <ArrowLeftRight
                                size={20}
                            />
                        </div>

                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                Transfer
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Send money
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Recent transactions */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-[#0a1626]">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Activity
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                            Recent transactions
                        </h2>
                    </div>

                    <Link
                        to="/transactions"
                        className="text-sm font-semibold text-[#b8941f] transition hover:text-[#8f7417] dark:text-[#d4af37] dark:hover:text-[#ecd36d]"
                    >
                        View all
                    </Link>
                </div>

                {transactions.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <ArrowLeftRight
                                size={20}
                                className="text-slate-400"
                            />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                            No transactions yet
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Your recent payment activity
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {transactions.map(
                            (transaction) => {
                                const Icon =
                                    getTransactionIcon(
                                        transaction.type
                                    );

                                return (
                                    <div
                                        key={
                                            transaction.id
                                        }
                                        className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getTransactionStyle(
                                                    transaction.type
                                                )}`}
                                            >
                                                <Icon
                                                    size={
                                                        18
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                    {
                                                        transaction.type
                                                    }
                                                </p>

                                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                    {transaction.description ||
                                                        "Payment transaction"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p
                                                className={`text-sm font-bold ${
                                                    transaction.type ===
                                                    "DEPOSIT"
                                                        ? "text-emerald-500"
                                                        : "text-slate-900 dark:text-white"
                                                }`}
                                            >
                                                {getAmountPrefix(
                                                    transaction.type
                                                )}
                                                {transaction.type ===
                                                "DEPOSIT"
                                                    ? " "
                                                    : " "}
                                                {account?.currency ||
                                                    "KES"}{" "}
                                                {formatAmount(
                                                    Number(
                                                        transaction.amount
                                                    )
                                                )}
                                            </p>

                                            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                {
                                                    transaction.status
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;
