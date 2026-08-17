import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import "./App.css";

function App() {
    const { isAuthenticated, userEmail, logout } = useAuth();

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>FinPay</h1>
                    <p>Payment Management Platform</p>
                </div>

                <button onClick={logout}>
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                <section className="welcome-card">
                    <p className="eyebrow">ACCOUNT</p>

                    <h2>Welcome to FinPay</h2>

                    <p>
                        You are signed in as{" "}
                        <strong>{userEmail}</strong>
                    </p>
                </section>

                <Accounts />

                <Transactions />

                <section className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Security</h3>
                        <p>
                            Your session is protected by JWT
                            authentication.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
