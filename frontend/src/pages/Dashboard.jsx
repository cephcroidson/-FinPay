import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { userEmail } = useAuth();

    return (
        <>
            <section className="welcome-card">
                <p className="eyebrow">ACCOUNT</p>

                <h2>Welcome to FinPay</h2>

                <p>
                    You are signed in as{" "}
                    <strong>{userEmail}</strong>
                </p>
            </section>

            <section className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Security</h3>

                    <p>
                        Your session is protected by JWT
                        authentication.
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Payments</h3>

                    <p>
                        Manage accounts and transactions
                        securely through FinPay.
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Account</h3>

                    <p>
                        View your balance and account
                        information.
                    </p>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
