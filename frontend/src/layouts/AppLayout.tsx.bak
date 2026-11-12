import {
    Bell,
    ChevronDown,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Settings,
    ShieldCheck,
    Sun,
    WalletCards,
    X,
    ArrowLeftRight,
    UserCircle,
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useAuth } from "../context/AuthContext";

function AppLayout() {
    const { userEmail, logout } = useAuth();
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState<boolean>(false);

    const [darkMode, setDarkMode] =
        useState<boolean>(true);

    const [profileMenuOpen, setProfileMenuOpen] =
        useState<boolean>(false);

    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            darkMode
        );
    }, [darkMode]);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(
                    event.target as Node
                )
            ) {
                setProfileMenuOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    function closeMobileMenu(): void {
        setMobileMenuOpen(false);
    }

    function openProfile(): void {
        setProfileMenuOpen(false);
        navigate("/profile");
    }

    function handleLogout(): void {
        setProfileMenuOpen(false);
        logout();
    }

    const navigation = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Accounts",
            path: "/accounts",
            icon: WalletCards,
        },
        {
            label: "Transactions",
            path: "/transactions",
            icon: ArrowLeftRight,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#07111f] dark:text-slate-100">
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={closeMobileMenu}
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800/80 dark:bg-[#0a1626] lg:translate-x-0 ${
                    mobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800/80">
                    <NavLink
                        to="/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37] shadow-lg shadow-[#d4af37]/20">
                            <CreditCard
                                size={21}
                                className="text-[#07111f]"
                            />
                        </div>

                        <div>
                            <div className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                                FinPay
                            </div>

                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Payments
                            </div>
                        </div>
                    </NavLink>

                    <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-7">
                    <div>
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Overview
                        </p>

                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                                isActive
                                                    ? "bg-[#d4af37]/10 text-[#b8941f] dark:bg-[#d4af37]/10 dark:text-[#e5c45a]"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    size={19}
                                                    strokeWidth={
                                                        isActive
                                                            ? 2.4
                                                            : 2
                                                    }
                                                />

                                                <span>
                                                    {item.label}
                                                </span>

                                                {isActive && (
                                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Management
                        </p>

                        <div className="space-y-1">
                            <NavLink
                                to="/security"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-[#d4af37]/10 text-[#b8941f] dark:bg-[#d4af37]/10 dark:text-[#e5c45a]"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                                    }`
                                }
                            >
                                <ShieldCheck size={19} />
                                <span>Security</span>
                            </NavLink>

                            <NavLink
                                to="/settings"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-[#d4af37]/10 text-[#b8941f] dark:bg-[#d4af37]/10 dark:text-[#e5c45a]"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                                    }`
                                }
                            >
                                <Settings size={19} />
                                <span>Settings</span>
                            </NavLink>
                        </div>
                    </div>
                </nav>

                <div className="border-t border-slate-200 p-4 dark:border-slate-800/80">
                    <div className="flex items-center gap-3 rounded-xl p-2">
                        <button
                            type="button"
                            onClick={openProfile}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white transition hover:scale-105 dark:bg-[#d4af37] dark:text-[#07111f]"
                            aria-label="Open profile"
                            title="Profile"
                        >
                            {userEmail
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                        </button>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                {userEmail}
                            </p>

                            <p className="text-xs text-slate-400">
                                FinPay User
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                            aria-label="Logout"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-slate-800/80 dark:bg-[#07111f]/90">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(true)
                            }
                            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Open menu"
                        >
                            <Menu size={21} />
                        </button>

                        <div className="lg:hidden">
                            <span className="text-lg font-bold text-slate-950 dark:text-white">
                                FinPay
                            </span>
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-xs font-medium text-slate-400">
                                PAYMENT MANAGEMENT PLATFORM
                            </p>

                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Secure financial operations
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setDarkMode(
                                    (previous) =>
                                        !previous
                                )
                            }
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label="Toggle theme"
                            title="Toggle theme"
                        >
                            {darkMode ? (
                                <Sun size={18} />
                            ) : (
                                <Moon size={18} />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/notifications")
                            }
                            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label="Notifications"
                            title="Notifications"
                        >
                            <Bell size={18} />

                            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                        </button>

                        <div
                            ref={profileMenuRef}
                            className="relative hidden sm:block"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileMenuOpen(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="flex items-center gap-2 rounded-xl border-l border-slate-200 pl-3 dark:border-slate-800"
                                aria-label="Open user menu"
                                aria-expanded={profileMenuOpen}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-[#d4af37] dark:text-[#07111f]">
                                    {userEmail
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                        "U"}
                                </div>

                                <ChevronDown
                                    size={16}
                                    className={`text-slate-400 transition ${
                                        profileMenuOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0a1626]">
                                    <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                                        <p className="text-sm font-semibold text-slate-950 dark:text-white">
                                            {userEmail}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            FinPay User
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            type="button"
                                            onClick={openProfile}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <UserCircle size={18} />
                                            Profile
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                navigate("/security");
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <ShieldCheck size={18} />
                                            Security
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                navigate("/settings");
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <Settings size={18} />
                                            Settings
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-5rem)] bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 dark:bg-[#07111f]">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
