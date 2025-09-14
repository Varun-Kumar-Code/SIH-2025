import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./SignUpPage.css";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="signup-background">
      <div className="signup-glass">
        <h2>Create an account</h2>
        <form>
          <input type="text" placeholder="Phone number" className="signup-input" />
          <input type="email" placeholder="Email" className="signup-input" />
          <div className="password-row">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="signup-input"
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <div className="password-row">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="signup-input"
            />
            <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <button type="submit" className="signup-button">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
 