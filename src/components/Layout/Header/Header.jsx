import { FaRocket, FaFire } from "react-icons/fa";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <header className="header">
      <nav className="nav container">
        {/* Left Logo */}
        <div className="nav-left" onClick={() => navigate("/")}>
          <FaRocket className="logo-icon" />
          <h1 className="logo-text">NextStep AI</h1>
        </div>

        {/* Nav Links */}
        <div className="nav-links">
          <NavLink to="/cv-builder">Resume Builder</NavLink>
          <NavLink to="/interview-practice">Interview Practice</NavLink>
          <NavLink to="/instructor-assistant" >instructor assistant</NavLink>
          
        </div>

        {/* Right Side */}
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <span className="usernam  e-display" onClick={() => {
                navigate('/profile')
              }}>{user?.firstName || user?.email}</span>
              <button className="btn-secondary logout-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn-primary signup-btn" onClick={() => navigate("/login")}>Log In</button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
