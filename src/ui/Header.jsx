import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
    const { logout, isAuthenticated } = useAuth();
    function handlesubmit() {
        logout();
    }
    return (
        <div>
            Header
            {isAuthenticated ? (
                <button onClick={handlesubmit}>Logout</button>
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
