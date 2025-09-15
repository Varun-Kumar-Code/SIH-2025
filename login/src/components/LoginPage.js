import React from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="login-background">
      <div className="login-glass">
        <h2>Welcome back!</h2>
        <form>
          <input type="email" placeholder="Email" className="login-input" />
          <div className="password-row">
            <input type="password" placeholder="Password" className="login-input" />
            <span className="eye-icon">&#128065;</span>
          </div>

          <a href="#" className="forgot-link">FORGOT PASSWORD?</a>
          <button type="submit" className="login-button">LOG IN</button>
        </form>

        <div className="divider">or sign in with</div>
        <div className="social-icons">
          <button className="icon google" title="Google"></button>
          <button className="icon apple" title="Apple"></button>
          <button className="icon facebook" title="Facebook"></button>
        </div>

        <div className="signup-row">
          Don't have an account? <Link to="/signup" className="signup-link">SIGN UP</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
