import { useEffect, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Copy,
    CreditCard,
    Fingerprint,
    Plus,
    ShieldCheck,
    Wallet,
    RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
    createMyAccount,
    getMyAccount,
} from "../api/accountApi";

import type { Account } from "../types/account";

export default function Accounts() {
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    async function loadAccount() {
        try {
            setLoading(true);
            setError("");

            const result = await getMyAccount();
            setAccount(result);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to load your account.";

            if (
                typeof err === "object" &&
                err !== null &&
                "status" in err &&
                (err as { status?: number }).status === 404
            ) {
                setAccount(null);
                setError("");
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadAccount();
    }, []);

    async function handleCreateAccount() {
        try {
            setCreating(true);
            setError("");

            const newAccount = await createMyAccount();

            if (newAccount) {
                setAccount(newAccount);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create your account."
            );
        } finally {
            setCreating(false);
        }
    }

    async function handleCopy() {
        if (!account) return;

        try {
            await navigator.clipboard.writeText(account.accountNumber);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setError("Unable to copy account number.");
        }
    }

    function formatBalance(balance: number, currency: string) {
        return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
        }).format(balance);
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
            </div>
        );
    }

    if (error && !account) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                        <h2 className="font-semibold text-red-800 dark:text-red-200">
                            Unable to load account
                        </h2>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={() => void loadAccount()}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            <RefreshCw size={15} />
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B18D48]">
                        Banking
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#172B45] dark:text-white">
                        My account
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        View your account details and manage your payment account.
                    </p>
                </div>

                {account && (
                    <Link
                        to="/transactions"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10243D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1A385C] dark:bg-[#C7A45B] dark:text-[#10243D] dark:hover:bg-[#D8B96F]"
                    >
                        Go to transactions
                        <ArrowRight size={16} />
                    </Link>
                )}
            </section>

            {!account ? (
                <section className="relative overflow-hidden rounded-[28px] border border-[#E6EAF0] bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-[#122238] sm:p-10">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#C7A45B]/10 blur-3xl" />
                    <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

                    <div className="relative mx-auto max-w-2xl text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6F0E4] text-[#9B783A] dark:bg-[#C7A45B]/10 dark:text-[#D8B96F]">
                            <Wallet size={29} />
                        </div>

                        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B18D48]">
                            Get started
                        </p>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#172B45] dark:text-white sm:text-3xl">
                            Your FinPay account starts here
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                            Create your payment account. FinPay will generate a
                            unique account number and associate it with your
                            authenticated profile.
                        </p>

                        {error && (
                            <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                                {error}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => void handleCreateAccount()}
                            disabled={creating}
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#10243D] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#10243D]/15 transition hover:-translate-y-0.5 hover:bg-[#1A385C] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#C7A45B] dark:text-[#10243D] dark:hover:bg-[#D8B96F]"
                        >
                            {creating ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <Plus size={17} />
                                    Create FinPay account
                                </>
                            )}
                        </button>

                        <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
                            {[
                                {
                                    icon: Fingerprint,
                                    title: "Linked identity",
                                    description: "Associated with your authenticated profile.",
                                },
                                {
                                    icon: CreditCard,
                                    title: "Unique account",
                                    description: "A unique account number is generated.",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Protected access",
                                    description: "Account operations require authentication.",
                                },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 dark:border-slate-700 dark:bg-slate-900/50"
                                    >
                                        <Icon size={19} className="text-[#B18D48]" />
                                        <p className="mt-3 text-sm font-semibold text-[#172B45] dark:text-white">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                            {item.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    <section className="relative overflow-hidden rounded-[28px] bg-[#10243D] p-7 text-white shadow-xl shadow-[#10243D]/10 sm:p-9">
                        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-[#C7A45B]/10" />
                        <div className="absolute -bottom-36 right-1/3 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

                        <div className="relative">
                            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08]">
                                            <Wallet size={20} className="text-[#D8B96F]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                FinPay payment account
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-slate-200">
                                                {account.currency} account
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-9 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                        Available balance
                                    </p>
                                    <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                                        {formatBalance(
                                            Number(account.balance),
                                            account.currency
                                        )}
                                    </p>
                                </div>

                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                                    <CheckCircle2 size={14} />
                                    {account.status}
                                </span>
                            </div>

                            <div className="mt-9 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                        Account number
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-3">
                                        <p className="font-mono text-lg font-semibold tracking-wider text-white">
                                            {account.accountNumber}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => void handleCopy()}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-[#C7A45B]/60 hover:text-white"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle2 size={13} className="text-emerald-400" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={13} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">
                                    FinPay · Secure digital payments
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                icon: CreditCard,
                                label: "Account type",
                                value: "Payment account",
                            },
                            {
                                icon: Wallet,
                                label: "Account currency",
                                value: account.currency,
                            },
                            {
                                icon: ShieldCheck,
                                label: "Access protection",
                                value: "Authenticated",
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#122238]"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6F0E4] text-[#9B783A] dark:bg-[#C7A45B]/10 dark:text-[#D8B96F]">
                                        <Icon size={19} />
                                    </div>
                                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-[#172B45] dark:text-white">
                                        {item.value}
                                    </p>
                                </div>
                            );
                        })}
                    </section>

                    <section className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20 sm:flex-row sm:items-start">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                                Your account is protected
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-emerald-800/75 dark:text-emerald-300/75">
                                FinPay uses authenticated access controls to
                                protect account information and payment
                                operations.
                            </p>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
