import type { CSSProperties, MouseEventHandler } from "react";
import { Link } from "react-router-dom";

type BrandLogoProps = {
    compact?: boolean;
    className?: string;
    style?: CSSProperties;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function BrandLogo({
    compact = false,
    className = "",
    style,
    onClick,
}: BrandLogoProps) {
    return (
        <Link
            to="/dashboard"
            aria-label="FinPay dashboard"
            onClick={onClick}
            className={`finpay-brand shrink-0 ${className}`.trim()}
            style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                minWidth: 0,
                ...style,
            }}
        >
            <img
                src="/brand/finpay-logo.png"
                alt="FinPay — Manage, Pay, Grow"
                style={{
                    display: "block",
                    width: compact ? "44px" : "164px",
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain",
                }}
            />
        </Link>
    );
}
