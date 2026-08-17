import { useEffect, useState } from "react";
import { getMyAccount } from "../api/accountApi";

function Accounts() {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAccount() {
            try {
                const data = await getMyAccount();
          
                setAccount(data);
            } catch (err) {
                setError(err.message || "Failed to load account");
            } finally {
                setLoading(false);
            }
        }

        loadAccount();
    }, []);

    if (loading) {
        return (
            <section className="account-section">
                <p>Loading account...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="account-section">
                <div className="account-error">
                    {error}
                </div>
            </section>
        );
    }

    return (
        <section className="account-section">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">ACCOUNT</p>
                    <h2>My Account</h2>
                </div>
            </div>

            <div className="account-card">
                <div className="account-card-header">
                    <div>
                        <p className="account-label">
                            FinPay Account
                        </p>

                        <h3>{account.accountNumber}</h3>
                    </div>

                    <span className="account-status">
                        {account.status}
                    </span>
                </div>

                <div className="account-balance">
                    <p>Available Balance</p>

                    <h2>
                        {account.currency}{" "}
                        {Number(account.balance).toFixed(2)}
                    </h2>
                </div>

                <div className="account-details">
                    <div>
                        <span>Currency</span>
                        <strong>{account.currency}</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>{account.status}</strong>
                    </div>

                    <div>
                        <span>Account ID</span>
                        <strong>{account.id}</strong>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Accounts;
