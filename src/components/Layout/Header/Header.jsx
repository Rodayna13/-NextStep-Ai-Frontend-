import { FaRocket } from "react-icons/fa";
import "./Header.css";
import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <header className="header">
      <nav className="nav container">
        {/* Left Logo */}
        <div className="nav-left">
          <FaRocket className="logo-icon" />
          <h1 className="logo-text">NextStep AI</h1>
        </div>

        {/* Nav Links */}
        <div className="nav-links">
          <NavLink to="/">Resume Builder</NavLink>
          <NavLink to="/interview-practice">Interview Practice</NavLink>
          <a href="#">Quiz Creator</a>
        </div>

        {/* Right Side */}
        <div className="nav-right">
          <button className="btn-link">Log In</button>
          <button className="btn-primary">Create My Resume</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
