import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="not-found">
            <p className="eyebrow">404</p>

            <h1>Page Not Found</h1>

            <p>
                The page you are looking for does not exist.
            </p>

            <Link to="/dashboard">
                Return to Dashboard
            </Link>
        </div>
    );
}

export default NotFound;
