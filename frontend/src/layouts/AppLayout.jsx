import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppLayout() {
    const { userEmail, logout } = useAuth();

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>FinPay</h1>
                    <p>Payment Management Platform</p>
                </div>

                <nav>
                    <NavLink to="/dashboard">
                        Dashboard
                    </NavLink>

                    <NavLink to="/accounts">
                        Accounts
                    </NavLink>

                    <NavLink to="/transactions">
                        Transactions
                    </NavLink>
                </nav>

                <div>
                    <span>{userEmail}</span>

                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
