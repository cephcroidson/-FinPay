import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Copy,
    CreditCard,
    Fingerprint,
    Plus,
    ShieldCheck,
    Wallet,
} from "lucide-react";

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

            // A 404 here means the authenticated user has not
            // created a FinPay account yet.
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
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to create your account.";

            setError(message);
        } finally {
            setCreating(false);
        }
    }

    async function handleCopy() {
        if (!account) return;

        try {
            await navigator.clipboard.writeText(account.accountNumber);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2000);
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
                <div>
                    <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />
                    <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-800" />
                </div>

                <div className="h-72 animate-pulse rounded-3xl bg-slate-900" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        My Account
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Manage your FinPay account.
                    </p>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                        <div>
                            <p className="font-medium text-red-300">
                                Unable to load account
                            </p>
                            <p className="mt-1 text-sm text-red-200/80">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() => void loadAccount()}
                                className="mt-4 rounded-xl bg-red-500/15 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/25"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        My Account
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Create your FinPay account to start managing payments.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

                    <div className="relative mx-auto max-w-2xl text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
                            <Wallet className="h-8 w-8 text-amber-300" />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-white">
                            Your FinPay account is ready to be created
                        </h2>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                            Create your secure payment account. Your account
                            number will be generated automatically and linked
                            to your authenticated FinPay profile.
                        </p>

                        <button
                            type="button"
                            onClick={() => void handleCreateAccount()}
                            disabled={creating}
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {creating ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Create FinPay Account
                                </>
                            )}
                        </button>

                        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                                <Fingerprint className="h-5 w-5 text-amber-300" />
                                <p className="mt-3 text-sm font-semibold text-white">
                                    Secure identity
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Linked to your authenticated profile.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                                <CreditCard className="h-5 w-5 text-amber-300" />
                                <p className="mt-3 text-sm font-semibold text-white">
                                    Unique account
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    A unique account number is generated for you.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                                <ShieldCheck className="h-5 w-5 text-amber-300" />
                                <p className="mt-3 text-sm font-semibold text-white">
                                    Protected access
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Account operations require authentication.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    My Account
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    Your FinPay payment account and security information.
                </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

                <div className="relative">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                                    <Wallet className="h-5 w-5 text-amber-300" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                        FinPay Account
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-300">
                                        {account.currency} account
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                    Available Balance
                                </p>

                                <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                    {formatBalance(
                                        account.balance,
                                        account.currency
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {account.status}
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Account Number
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <p className="font-mono text-lg font-semibold tracking-wider text-white">
                                {account.accountNumber}
                            </p>

                            <button
                                type="button"
                                onClick={() => void handleCopy()}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-amber-400/30 hover:text-white"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <CreditCard className="h-5 w-5 text-amber-300" />
                    <p className="mt-4 text-xs uppercase tracking-[0.15em] text-slate-500">
                        Account Type
                    </p>
                    <p className="mt-1 font-semibold text-white">
                        Payment Account
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <Wallet className="h-5 w-5 text-amber-300" />
                    <p className="mt-4 text-xs uppercase tracking-[0.15em] text-slate-500">
                        Currency
                    </p>
                    <p className="mt-1 font-semibold text-white">
                        {account.currency}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <ShieldCheck className="h-5 w-5 text-amber-300" />
                    <p className="mt-4 text-xs uppercase tracking-[0.15em] text-slate-500">
                        Security
                    </p>
                    <p className="mt-1 font-semibold text-white">
                        Authenticated
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                    <div>
                        <p className="font-semibold text-emerald-300">
                            Your account is protected
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            FinPay uses authenticated access controls to protect
                            your account information and payment operations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
