import {
    Bell,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";

export default function Notifications() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8941f] dark:text-[#e5c45a]">
                    Updates
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Notifications
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Important updates and security notifications from FinPay.
                </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#b8941f] dark:text-[#e5c45a]">
                        <Bell size={20} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-950 dark:text-white">
                            Notification center
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Your latest FinPay updates
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>

                        <div>
                            <p className="font-semibold text-slate-950 dark:text-white">
                                FinPay account active
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Your FinPay payment account is active and ready
                                for authenticated financial operations.
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/10">
                            <ShieldCheck className="h-5 w-5 text-[#b8941f] dark:text-[#e5c45a]" />
                        </div>

                        <div>
                            <p className="font-semibold text-slate-950 dark:text-white">
                                Secure session
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Your current FinPay session is authenticated and
                                protected by the application security layer.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
