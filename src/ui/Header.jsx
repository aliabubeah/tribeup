import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    function handlesubmit() {
        logout();
        navigate("/login");
    }
    return (
        <div>
            <Link to="/">Header</Link>
            {isAuthenticated ? (
                <div>
                    <button onClick={handlesubmit}>Logout</button>
                    <Link to="/profile">Profile</Link>
                </div>
            ) : (
                <div>
                    <Link to="/login">login</Link>
                    <br></br>
                    <Link to="/register">register</Link>
                </div>
            )}
        </div>
    );
}

export default Header;
