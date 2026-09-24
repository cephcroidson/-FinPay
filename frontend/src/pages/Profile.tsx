import {
    Mail,
    ShieldCheck,
    UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { userEmail } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8941f] dark:text-[#e5c45a]">
                    Account
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your FinPay profile information.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d4af37] text-2xl font-bold text-[#07111f]">
                            {userEmail?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                            FinPay User
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Personal payment profile
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                            <ShieldCheck size={14} />
                            Authenticated
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#b8941f] dark:text-[#e5c45a]">
                            <UserCircle size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-950 dark:text-white">
                                Personal information
                            </h2>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Your authenticated FinPay identity
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <Mail
                                size={18}
                                className="text-slate-400"
                            />

                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                                    Email address
                                </p>

                                <p className="mt-1 break-all text-sm font-medium text-slate-900 dark:text-white">
                                    {userEmail || "Not available"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            Profile editing
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Additional profile fields and editing controls will
                            be connected to the authenticated user API as the
                            account-management module expands.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
