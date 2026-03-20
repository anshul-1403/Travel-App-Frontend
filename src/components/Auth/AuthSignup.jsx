import "./Auth.css";
import { useAuth, useAlert } from "../../context";
import {
  validateEmail,
  validateName,
  validateNumber,
  validatePassword,
} from "../../utils";
import { signupHandler } from "../../services";
import { useState } from "react";

let isNumberValid,
  isNameValid,
  isEmailValid,
  isPasswordValid,
  isConfirmPasswordValid;

export const AuthSignup = () => {
  const { username, email, password, number, authDispatch } =
    useAuth();
  const { setAlert } = useAlert();

  const [errors, setErrors] = useState({});

  const handleNumberChange = (e) => {
    isNumberValid = validateNumber(e.target.value);
    setErrors((prev) => ({
      ...prev,
      number: isNumberValid ? "" : "Enter valid 10-digit mobile number",
    }));
    if (isNumberValid) {
      authDispatch({ type: "NUMBER", payload: e.target.value });
    }
  };

  const handleNameChange = (e) => {
    isNameValid = validateName(e.target.value);
    setErrors((prev) => ({
      ...prev,
      name: isNameValid ? "" : "Name should contain only letters",
    }));
    if (isNameValid) {
      authDispatch({ type: "NAME", payload: e.target.value });
    }
  };

  const handleEmailChange = (e) => {
    isEmailValid = validateEmail(e.target.value);
    setErrors((prev) => ({
      ...prev,
      email: isEmailValid ? "" : "Enter a valid email address",
    }));
    if (isEmailValid) {
      authDispatch({ type: "EMAIL", payload: e.target.value });
    }
  };

  const handlePasswordChange = (e) => {
    isPasswordValid = validatePassword(e.target.value);
    setErrors((prev) => ({
      ...prev,
      password: isPasswordValid
        ? ""
        : "Password must be 8+ chars, uppercase, lowercase, number & symbol",
    }));
    if (isPasswordValid) {
      authDispatch({ type: "PASSWORD", payload: e.target.value });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    isConfirmPasswordValid = e.target.value === password;
    setErrors((prev) => ({
      ...prev,
      confirmPassword: isConfirmPasswordValid
        ? ""
        : "Passwords do not match",
    }));
    if (isConfirmPasswordValid) {
      authDispatch({ type: "CONFIRM_PASSWORD", payload: e.target.value });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      isNumberValid &&
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      signupHandler(username, number, email, password, setAlert, ({ accessToken, username: loggedInUsername, role }) => {
        authDispatch({ type: "SET_ACCESS_TOKEN", payload: accessToken });
        authDispatch({ type: "SET_USERNAME", payload: loggedInUsername });
        authDispatch({ type: "SET_USER_ROLE", payload: role });
        authDispatch({ type: "HIDE_AUTH_MODAL" });
      });
      authDispatch({ type: "CLEAR_USER_DATA" });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleFormSubmit}>
        <div className="lb-in-container">
          <label className="auth-label">
            Mobile Number <span className="asterisk">*</span>
          </label>
          <input className="auth-input" type="number" onChange={handleNumberChange} />
          {errors.number && <p className="auth-error">{errors.number}</p>}
        </div>

        <div className="lb-in-container">
          <label className="auth-label">
            Name <span className="asterisk">*</span>
          </label>
          <input className="auth-input" onChange={handleNameChange} />
          {errors.name && <p className="auth-error">{errors.name}</p>}
        </div>

        <div className="lb-in-container">
          <label className="auth-label">
            Email <span className="asterisk">*</span>
          </label>
          <input className="auth-input" type="email" onChange={handleEmailChange} />
          {errors.email && <p className="auth-error">{errors.email}</p>}
        </div>

        <div className="lb-in-container">
          <label className="auth-label">
            Password <span className="asterisk">*</span>
          </label>
          <input className="auth-input" type="password" onChange={handlePasswordChange} />
          {errors.password && <p className="auth-error">{errors.password}</p>}
        </div>

        <div className="lb-in-container">
          <label className="auth-label">
            Confirm Password <span className="asterisk">*</span>
          </label>
          <input className="auth-input" type="password" onChange={handleConfirmPasswordChange} />
          {errors.confirmPassword && (
            <p className="auth-error">{errors.confirmPassword}</p>
          )}
        </div>

        <button className="button btn-primary btn-login cursor">Submit</button>
      </form>
    </div>
  );
};
