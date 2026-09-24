import {
    Bell,
    MonitorCog,
    Palette,
    Settings as SettingsIcon,
} from "lucide-react";

export default function Settings() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8941f] dark:text-[#e5c45a]">
                    Preferences
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Configure your FinPay application preferences.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <SettingCard
                    icon={Palette}
                    title="Appearance"
                    description="Switch between the FinPay light and dark visual themes using the theme control in the top bar."
                    status="Available"
                />

                <SettingCard
                    icon={Bell}
                    title="Notifications"
                    description="Manage how FinPay presents account and payment notifications."
                    status="Available"
                />

                <SettingCard
                    icon={MonitorCog}
                    title="Application preferences"
                    description="Additional dashboard and transaction preferences will be added as the platform expands."
                    status="Planned"
                />

                <SettingCard
                    icon={SettingsIcon}
                    title="Account preferences"
                    description="Account-level preferences will be connected to the FinPay user settings API."
                    status="Planned"
                />
            </div>
        </div>
    );
}

function SettingCard({
    icon: Icon,
    title,
    description,
    status,
}: {
    icon: typeof Palette;
    title: string;
    description: string;
    status: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#b8941f] dark:text-[#e5c45a]">
                <Icon size={20} />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
                <h2 className="font-semibold text-slate-950 dark:text-white">
                    {title}
                </h2>

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {status}
                </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </div>
    );
}
