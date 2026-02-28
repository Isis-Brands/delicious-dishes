import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { isAuthenticated, loginWithToken, logout } = useAuth();

    return (
        <div className="panel">
            <h1 className="pageTitle">Login</h1>
            <p className="lead">Log in to view and manage your favorites.</p>

            {isAuthenticated ? (
                <>
                    <p className="muted">You are logged in.</p>
                    <div className="row" style={{ marginTop: 12 }}>
                        <button className="btn" onClick={logout}>Logout</button>
                    </div>
                </>
            ) : (
                <>
                    <p className="muted">Test login (temporary):</p>
                    <div className="row" style={{ marginTop: 12 }}>
                        <button className="btn btnPrimary" onClick={() => loginWithToken("fake-token")}>
                            Login
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}