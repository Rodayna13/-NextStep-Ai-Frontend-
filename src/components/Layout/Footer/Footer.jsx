import "./Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer mt-auto">
            <div className="container footer-grid">
                <div>
                    <h3>NextStep AI</h3>
                    <p>Your professional resume builder.</p>
                </div>

                <div>
                    <h3>Product</h3>
                    <ul>
                        <li><a href="#">Templates</a></li>
                        <li><a href="#">Examples</a></li>
                        <li><a href="#">Pricing</a></li>
                    </ul>
                </div>

                <div>
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div>
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom container">
                <p>© 2024 ResumeCraft. All rights reserved.</p>
                <div className="socials">
                    <FaFacebook />
                    <FaTwitter />
                    <FaLinkedin />
                    <FaGithub />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
