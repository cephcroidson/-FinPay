import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface LocationState {
    from?: {
        pathname?: string;
    };
}

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] =
        useState<boolean>(false);

    const locationState =
        location.state as LocationState | null;

    const redirectPath =
        locationState?.from?.pathname &&
        locationState.from.pathname !== "/login"
            ? locationState.from.pathname
            : "/dashboard";

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        setError("");

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            await login(trimmedEmail, password);

            navigate(redirectPath, {
                replace: true,
            });
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Login failed. Please check your credentials.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }

    function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>
    ): void {
        setEmail(event.target.value);

        if (error) {
            setError("");
        }
    }

    function handlePasswordChange(
        event: ChangeEvent<HTMLInputElement>
    ): void {
        setPassword(event.target.value);

        if (error) {
            setError("");
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
                {/* Brand panel */}
                <section className="hidden flex-col justify-between border-r border-white/10 bg-[#07111f] p-10 lg:flex xl:p-14">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/10">
                                <LockKeyhole size={22} />
                            </div>

                            <div>
                                <p className="text-lg font-bold tracking-tight">
                                    FinPay
                                </p>

                                <p className="text-xs text-slate-500">
                                    Secure digital payments
                                </p>
                            </div>
                        </div>

                        <div className="mt-24 max-w-md">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                                Secure payments
                            </p>

                            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
                                Your money.
                                <br />
                                Your control.
                            </h1>

                            <p className="mt-6 text-base leading-7 text-slate-400">
                                Manage your digital payments,
                                accounts and transactions through
                                one secure FinPay platform.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-slate-600">
                        FinPay • Secure digital payments
                    </p>
                </section>

                {/* Login panel */}
                <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
                    <div className="w-full max-w-md">
                        {/* Mobile branding */}
                        <div className="mb-12 lg:hidden">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                                    <LockKeyhole size={20} />
                                </div>

                                <div>
                                    <p className="font-bold tracking-tight">
                                        FinPay
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Secure digital payments
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                                Welcome back
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                Sign in to FinPay
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Access your account and manage your
                                digital payments securely.
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-5"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-200"
                                >
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={
                                            handleEmailChange
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-200"
                                    >
                                        Password
                                    </label>
                                </div>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign In"}

                                {!loading && (
                                    <ArrowRight size={17} />
                                )}
                            </button>
                        </form>

                        {/* Registration */}
                        <div className="mt-8 border-t border-white/10 pt-7 text-center">
                            <p className="text-sm text-slate-400">
                                Don't have a FinPay account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-amber-400 transition hover:text-amber-300"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>

                        <p className="mt-8 text-center text-xs leading-5 text-slate-600">
                            Your credentials are securely
                            transmitted to the FinPay API.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Login;
