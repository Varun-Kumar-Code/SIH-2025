import React from "react";
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
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
