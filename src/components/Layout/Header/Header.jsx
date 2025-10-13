import { FaRocket } from "react-icons/fa";
import "./Header.css";
const Header = () => {
  return (
    <header className="header">
      <nav className="nav container">
        {/* Left Logo */}
        <div className="nav-left">
          <FaRocket className="logo-icon" />
          <h1 className="logo-text">ResumeCraft</h1>
        </div>

        {/* Nav Links */}
        <div className="nav-links">
          <a href="#">Templates</a>
          <a href="#">Examples</a>
          <a href="#">Pricing</a>
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
