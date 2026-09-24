import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/authApi";
import type { RegisterUserRequest } from "../types/user";

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: undefined,
            general: undefined,
        }));
    }

    function validate(): FormErrors {
        const nextErrors: FormErrors = {};

        const firstName = form.firstName.trim();
        const lastName = form.lastName.trim();
        const email = form.email.trim();
        const phoneNumber = form.phoneNumber.trim();

        if (!firstName) {
            nextErrors.firstName = "First name is required.";
        }

        if (!lastName) {
            nextErrors.lastName = "Last name is required.";
        }

        if (!email) {
            nextErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!phoneNumber) {
            nextErrors.phoneNumber =
                "Phone number is required.";
        } else if (!/^(07|01)[0-9]{8}$/.test(phoneNumber)) {
            nextErrors.phoneNumber =
                "Use a valid Kenyan number, e.g. 0712345678.";
        }

        if (!form.password) {
            nextErrors.password = "Password is required.";
        } else if (form.password.length < 8) {
            nextErrors.password =
                "Password must be at least 8 characters.";
        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(
                form.password
            )
        ) {
            nextErrors.password =
                "Use uppercase, lowercase, number and special character.";
        }

        if (!form.confirmPassword) {
            nextErrors.confirmPassword =
                "Please confirm your password.";
        } else if (
            form.password !== form.confirmPassword
        ) {
            nextErrors.confirmPassword =
                "Passwords do not match.";
        }

        return nextErrors;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const payload: RegisterUserRequest = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
            password: form.password,
        };

        try {
            await register(payload);
            setSuccess(true);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.";

            setErrors({
                general: message,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (success) {
        return (
            <main className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-12">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                            <CheckCircle2
                                size={34}
                                className="text-emerald-400"
                            />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                            FinPay
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight">
                            Account created
                        </h1>

                        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
                            Your FinPay account has been created
                            successfully. You can now sign in
                            using your email and password.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login", {
                                    replace: true,
                                })
                            }
                            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 sm:w-auto"
                        >
                            Continue to Sign In
                            <ArrowRight size={17} />
                        </button>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.85fr_1.15fr]">
                <section className="hidden flex-col justify-between border-r border-white/10 bg-[#07111f] p-10 lg:flex xl:p-14">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/10">
                                <LockKeyhole size={22} />
                            </div>

                            <div>
                                <p className="text-lg font-bold">
                                    FinPay
                                </p>
                                <p className="text-xs text-slate-500">
                                    Secure digital payments
                                </p>
                            </div>
                        </div>

                        <div className="mt-24 max-w-md">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                                Get started
                            </p>

                            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
                                Your money.
                                <br />
                                Your control.
                            </h1>

                            <p className="mt-6 text-base leading-7 text-slate-400">
                                Create your FinPay account and
                                manage your digital payments from
                                one secure platform.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-slate-600">
                        FinPay • Secure digital payments
                    </p>
                </section>

                <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
                    <div className="w-full max-w-xl">
                        <div className="mb-8 lg:hidden">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                                    <LockKeyhole size={20} />
                                </div>

                                <div>
                                    <p className="font-bold">
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
                                Create account
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                Welcome to FinPay
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Enter your details to create your
                                secure payment account.
                            </p>
                        </div>

                        {errors.general && (
                            <div
                                role="alert"
                                className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            >
                                {errors.general}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-5"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="First name"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                    placeholder="Cephus"
                                    autoComplete="given-name"
                                />

                                <Field
                                    label="Last name"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                    placeholder="Ongata"
                                    autoComplete="family-name"
                                />
                            </div>

                            <Field
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="you@example.com"
                                autoComplete="email"
                                icon={<Mail size={17} />}
                            />

                            <Field
                                label="Phone number"
                                name="phoneNumber"
                                type="tel"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                error={errors.phoneNumber}
                                placeholder="0712345678"
                                autoComplete="tel"
                                inputMode="numeric"
                                icon={<Phone size={17} />}
                            />

                            <PasswordField
                                label="Password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                                show={showPassword}
                                onToggle={() =>
                                    setShowPassword(
                                        (current) => !current
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <PasswordField
                                label="Confirm password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                show={showConfirmPassword}
                                onToggle={() =>
                                    setShowConfirmPassword(
                                        (current) => !current
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-slate-400">
                                Password must contain at least 8
                                characters, including uppercase,
                                lowercase, a number and a special
                                character.
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300 disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "Creating account..."
                                    : "Create account"}

                                {!isSubmitting && (
                                    <ArrowRight size={17} />
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-amber-400 transition hover:text-amber-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

interface FieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: "text" | "numeric" | "tel" | "email";
    icon?: React.ReactNode;
}

function Field({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    autoComplete,
    inputMode,
    icon,
}: FieldProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-200"
            >
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        {icon}
                    </span>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? `${name}-error` : undefined
                    }
                    className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 ${
                        icon ? "pl-11" : ""
                    } ${
                        error
                            ? "border-red-500/50"
                            : "border-white/10"
                    }`}
                />
            </div>

            {error && (
                <p
                    id={`${name}-error`}
                    className="mt-1.5 text-xs text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

interface PasswordFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    show: boolean;
    onToggle: () => void;
    autoComplete?: string;
}

function PasswordField({
    label,
    name,
    value,
    onChange,
    error,
    show,
    onToggle,
    autoComplete,
}: PasswordFieldProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-200"
            >
                {label}
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <UserRound size={17} />
                </span>

                <input
                    id={name}
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? `${name}-error` : undefined
                    }
                    className={`w-full rounded-xl border bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 ${
                        error
                            ? "border-red-500/50"
                            : "border-white/10"
                    }`}
                />

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={
                        show
                            ? `Hide ${label.toLowerCase()}`
                            : `Show ${label.toLowerCase()}`
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
                >
                    {show ? (
                        <EyeOff size={17} />
                    ) : (
                        <Eye size={17} />
                    )}
                </button>
            </div>

            {error && (
                <p
                    id={`${name}-error`}
                    className="mt-1.5 text-xs text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default Register;
