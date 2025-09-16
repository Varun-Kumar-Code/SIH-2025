import React from "react";
import { Link } from "react-router-dom";  // ✅ import Link
import "./SignUpPage.css";

function SignUpPage() {
  return (
    <div className="signup-background">
      <div className="signup-glass">
        <h2>Create an account</h2>
        <form>
          <input type="text" placeholder="Full Name" className="signup-input" />
          <input type="tel" placeholder="Phone number" className="signup-input" />
          <input type="email" placeholder="Email" className="signup-input" />

          <div className="password-row">
            <input type="password" placeholder="Password" className="signup-input" />
            <span className="eye-icon">👁</span>
          </div>

          <div className="password-row">
            <input type="password" placeholder="Confirm Password" className="signup-input" />
            <span className="eye-icon">👁</span>
          </div>

          <button type="submit" className="signup-button">SIGN UP</button>

          {/* Social icons */}
          <div className="social-icons">
            <button type="button" className="icon google" title="Google"></button>
            <button type="button" className="icon apple" title="Apple"></button>
            <button type="button" className="icon facebook" title="Facebook"></button>
          </div>

          {/* Already have account link */}
          <div className="signup-row">
            Already have an account?{" "}
            <Link to="/login" className="switch-link">
              LOGIN
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
