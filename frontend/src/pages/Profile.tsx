import {
    Fingerprint,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { userEmail } = useAuth();
    const initial = userEmail?.charAt(0).toUpperCase() || "U";

    return (
        <div className="space-y-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A47F32] dark:text-[#D9B86C]">
                    Personal workspace
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Your profile
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    View the identity currently associated with your FinPay session.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <section className="relative overflow-hidden rounded-3xl bg-[#10243D] p-7 text-white shadow-xl shadow-slate-900/10">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#C7A45B]/30" />

                    <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E4C77F]/40 bg-[#C7A45B] text-3xl font-bold text-[#10243D] shadow-lg">
                            {initial}
                        </div>

                        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#D9C18E]">
                            FinPay customer
                        </p>
                        <h2 className="mt-2 break-all text-xl font-semibold">
                            {userEmail || "User profile"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                            Personal digital banking workspace
                        </p>

                        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Authenticated session
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#122238] sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C7A45B]/15 text-[#A47F32] dark:text-[#D9B86C]">
                            <UserRound size={21} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-950 dark:text-white">
                                Account identity
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Information available in this session
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 space-y-4">
                        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-700">
                            <Mail className="mt-0.5 shrink-0 text-slate-400" size={19} />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Email address
                                </p>
                                <p className="mt-1 break-all text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {userEmail || "Not available"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-700">
                            <Fingerprint className="mt-0.5 shrink-0 text-slate-400" size={19} />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Identity
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Authenticated FinPay user
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-700">
                            <LockKeyhole className="mt-0.5 shrink-0 text-slate-400" size={19} />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Access
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Protected application area
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                        <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" size={18} />
                        <p className="text-xs leading-5 text-emerald-800 dark:text-emerald-300">
                            Your profile is displayed within the authenticated FinPay application. Profile editing is not yet connected to a user-profile update API.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
