import {
    KeyRound,
    LockKeyhole,
    ShieldCheck,
    Smartphone,
} from "lucide-react";

export default function Security() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8941f] dark:text-[#e5c45a]">
                    Protection
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Security
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review the security controls protecting your FinPay
                    account.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <SecurityCard
                    icon={ShieldCheck}
                    title="Authenticated session"
                    description="Your FinPay session is protected by token-based authentication."
                    status="Active"
                />

                <SecurityCard
                    icon={LockKeyhole}
                    title="Account protection"
                    description="Financial account operations require an authenticated user."
                    status="Protected"
                />

                <SecurityCard
                    icon={KeyRound}
                    title="Password security"
                    description="Passwords are handled through the secured authentication layer."
                    status="Enabled"
                />

                <SecurityCard
                    icon={Smartphone}
                    title="Mobile security"
                    description="Mobile authentication and device controls will be integrated with the FinPay mobile application."
                    status="Planned"
                />
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            Security controls are being expanded
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Password change, device management, two-factor
                            authentication, and session management will be
                            connected to dedicated backend security services.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecurityCard({
    icon: Icon,
    title,
    description,
    status,
}: {
    icon: typeof ShieldCheck;
    title: string;
    description: string;
    status: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#b8941f] dark:text-[#e5c45a]">
                    <Icon size={20} />
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                    {status}
                </span>
            </div>

            <h2 className="mt-5 font-semibold text-slate-950 dark:text-white">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </div>
    );
}
