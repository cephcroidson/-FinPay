import {
    Bell,
    MonitorCog,
    Palette,
    ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type SettingCardProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    status: string;
    to?: string;
};

export default function Settings() {
    return (
        <div className="space-y-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A47F32] dark:text-[#D9B86C]">
                    Personalisation
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Settings
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Your FinPay application preferences and account controls.
                </p>
            </header>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#122238]">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C7A45B]/15 text-[#A47F32] dark:text-[#D9B86C]">
                        <MonitorCog size={21} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-950 dark:text-white">
                            Application preferences
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage the available FinPay experience
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Palette size={19} className="text-slate-500 dark:text-slate-400" />
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                Colour theme
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Switch between light and dark mode from the top navigation bar.
                            </p>
                        </div>
                    </div>
                    <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Available
                    </span>
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                        Account services
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Shortcuts to your FinPay account tools.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <SettingCard
                        icon={Bell}
                        title="Notifications"
                        description="View account and payment updates in your notification centre."
                        status="View centre"
                        to="/notifications"
                    />
                    <SettingCard
                        icon={ShieldCheck}
                        title="Security"
                        description="Review the security information and protection features currently provided by FinPay."
                        status="View security"
                        to="/security"
                    />
                </div>
            </section>

            <section className="rounded-2xl border border-dashed border-slate-300 p-5 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    More preferences are planned
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Advanced notification controls and account-level preference management require additional settings APIs and are not represented as active features yet.
                </p>
            </section>
        </div>
    );
}

function SettingCard({
    icon: Icon,
    title,
    description,
    status,
    to,
}: SettingCardProps) {
    const content = (
        <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C7A45B]/15 text-[#A47F32] dark:text-[#D9B86C]">
                <Icon size={21} />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-950 dark:text-white">
                    {title}
                </h3>
                <span className="text-[11px] font-semibold text-[#A47F32] dark:text-[#D9B86C]">
                    {status}
                </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </>
    );

    const className =
        "block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C7A45B]/60 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-[#122238] dark:hover:border-[#C7A45B]/50";

    return to ? (
        <Link to={to} className={className}>
            {content}
        </Link>
    ) : (
        <article className={className}>
            {content}
        </article>
    );
}
