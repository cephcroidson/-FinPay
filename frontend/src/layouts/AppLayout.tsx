import BrandLogo from "../components/BrandLogo";

import {
    ArrowLeftRight,
    Bell,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Settings,
    ShieldCheck,
    Sun,
    UserRound,
    WalletCards,
    X,
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const navigation = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        section: "Workspace",
    },
    {
        label: "Accounts",
        path: "/accounts",
        icon: WalletCards,
        section: "Workspace",
    },
    {
        label: "Transactions",
        path: "/transactions",
        icon: ArrowLeftRight,
        section: "Workspace",
    },
    {
        label: "Security",
        path: "/security",
        icon: ShieldCheck,
        section: "Account",
    },
    {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
        section: "Account",
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Settings,
        section: "Account",
    },
];

export default function AppLayout() {
    const { userEmail, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        () =>
            typeof window !== "undefined" &&
            window.localStorage.getItem("finpay-theme") === "dark"
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        window.localStorage.setItem(
            "finpay-theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    function handleLogout() {
        setMobileMenuOpen(false);
        logout();
    }

    const initial = userEmail?.charAt(0).toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-[#172B45] dark:bg-[#0B1727] dark:text-slate-100">
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation overlay"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#10243D] text-white shadow-2xl shadow-slate-950/10 transition-transform duration-300 ${
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-7">
                    <BrandLogo />

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-2 pt-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        Financial workspace
                    </p>
                </div>

                <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-5">
                    {["Workspace", "Account"].map((section) => (
                        <div key={section}>
                            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                {section}
                            </p>

                            <div className="space-y-1">
                                {navigation
                                    .filter((item) => item.section === section)
                                    .map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition ${
                                                        isActive
                                                            ? "bg-[#C7A45B] text-[#10243D] shadow-lg shadow-black/10"
                                                            : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <Icon
                                                            size={18}
                                                            strokeWidth={isActive ? 2.4 : 1.9}
                                                        />
                                                        <span>{item.label}</span>
                                                        {isActive && (
                                                            <ChevronRight
                                                                size={15}
                                                                className="ml-auto"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </NavLink>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#C7A45B]" />
                        <p className="text-xs font-semibold text-white">
                            Secure banking space
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                        Your financial workspace is protected by authenticated access.
                    </p>
                </div>

                <div className="border-t border-white/10 p-4">
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.07]"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C7A45B] text-sm font-bold text-[#10243D]">
                            {initial}
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-white">
                                {userEmail || "FinPay User"}
                            </span>
                            <span className="mt-1 block text-[10px] text-slate-400">
                                Personal account
                            </span>
                        </span>

                        <UserRound size={16} className="text-slate-400" />
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </aside>

            <div className="min-h-screen lg:pl-[270px]">
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#E6EAF0] bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0B1727]/90 sm:px-7 lg:px-10">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Open navigation"
                        >
                            <Menu size={19} />
                        </button>

                        <div>
                            <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                                FinPay / Digital banking
                            </p>
                            <p className="text-sm font-semibold text-[#172B45] dark:text-white">
                                {navigation.find(
                                    (item) => item.path === location.pathname
                                )?.label || "Your financial workspace"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 sm:inline-flex dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Secure session
                        </span>

                        <button
                            type="button"
                            onClick={() => setDarkMode((value) => !value)}
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Toggle colour theme"
                            title="Toggle colour theme"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/notifications")}
                            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Notifications"
                            title="Notifications"
                        >
                            <Bell size={18} />
                            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C7A45B]" />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#10243D] text-xs font-bold text-white ring-2 ring-[#C7A45B]/30 dark:bg-[#C7A45B] dark:text-[#10243D]"
                            aria-label="Open profile"
                        >
                            {initial}
                        </button>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-76px)] px-4 py-7 sm:px-7 sm:py-8 lg:px-10 lg:py-9">
                    <div className="mx-auto max-w-[1440px]">
                        <Outlet />
                    </div>
                </main>

                <footer className="border-t border-[#E6EAF0] px-4 py-5 text-center text-[11px] text-slate-400 dark:border-slate-800 sm:px-7 lg:px-10">
                    <span>FinPay</span>
                    <span className="mx-2">·</span>
                    <span>Secure digital payments</span>
                    <span className="mx-2">·</span>
                    <span>© {new Date().getFullYear()}</span>
                </footer>
            </div>
        </div>
    );
}
