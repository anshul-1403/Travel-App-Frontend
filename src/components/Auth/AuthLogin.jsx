import "./Auth.css";
import { useState } from "react";
import { validateNumber, validatePassword } from "../../utils";
import { loginHandler } from "../../services";
import { useAuth, useAlert } from "../../context";

export const AuthLogin = () => {
  const { authDispatch, number, password } = useAuth();
  const { setAlert } = useAlert();

  const [numberError, setNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (!validateNumber(value)) {
      setNumberError("Enter a valid 10-digit mobile number");
    } else {
      setNumberError("");
      authDispatch({ type: "NUMBER", payload: value });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (!validatePassword(value)) {
      setPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number & special character"
      );
    } else {
      setPasswordError("");
      authDispatch({ type: "PASSWORD", payload: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (numberError || passwordError || !number || !password) return;

    const { accessToken, username } = await loginHandler(
      number,
      password,
      setAlert
    );

    authDispatch({ type: "SET_ACCESS_TOKEN", payload: accessToken });
    authDispatch({ type: "SET_USER_NAME", payload: username });
    authDispatch({ type: "CLEAR_USER_DATA" });
    authDispatch({ type: "SHOW_AUTH_MODAL" });
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleFormSubmit}>
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Mobile Number <span className="asterisk">*</span>
          </label>
          <input
            value={number}
            type="number"
            className="auth-input"
            placeholder="Enter Mobile Number"
            required
            onChange={handleNumberChange}
          />
          {numberError && <span className="auth-error">{numberError}</span>}
        </div>

        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Password <span className="asterisk">*</span>
          </label>
          <input
            value={password}
            className="auth-input"
            placeholder="Enter Password"
            type="password"
            required
            onChange={handlePasswordChange}
          />
          {passwordError && <span className="auth-error">{passwordError}</span>}
        </div>

        <button className="button btn-primary btn-login cursor">Login</button>
      </form>
    </div>
  );
};
