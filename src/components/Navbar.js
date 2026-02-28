import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const linkClass = ({ isActive }) => `nav__link${isActive ? " active" : ""}`;

    return (
        <header className="nav">
            <div className="nav__inner">
                <div className="nav__brand">Delicious Dishes</div>

                <nav className="nav__links">
                    <NavLink to="/" className={linkClass} end>Home</NavLink>
                    <NavLink to="/recipes" className={linkClass}>Recipes</NavLink>
                    <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
                    <NavLink to="/login" className={linkClass}>Login</NavLink>
                </nav>
            </div>
        </header>
    );
}