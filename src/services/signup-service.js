import axios from "axios";

export const signupHandler = async (
  username,
  number,
  email,
  password,
  setAlert,
  onSuccess
) => {
  try {
    // Step 1: Register
    await axios.post(
      "https://travel-app-backend-zvzh.onrender.com/api/auth/register",
      { username, number, email, password }
    );

    // Step 2: Auto-login immediately after
    const {
      data: { accessToken, username: loggedInUsername, role },
    } = await axios.post("https://travel-app-backend-zvzh.onrender.com/api/auth/login", {
      number,
      password,
    });

    // Store in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("username", loggedInUsername);
    localStorage.setItem("role", role);

    // Call onSuccess callback with the login data
    if (onSuccess) {
      onSuccess({ accessToken, username: loggedInUsername, role });
    }

    setAlert({
      open: true,
      type: "success",
      message: `Welcome, ${loggedInUsername}! Your account has been created.`,
    });

  } catch (err) {
    console.error("Signup error:", err);

    if (err.response) {
      if (err.response.status === 409) {
        setAlert({
          open: true,
          type: "error",
          message: "Email or mobile number already exists",
        });
      } else {
        setAlert({
          open: true,
          type: "error",
          message: err.response.data?.message || "Signup failed",
        });
      }
    } else {
      setAlert({
        open: true,
        type: "error",
        message: "Server not reachable. Try again later.",
      });
    }
  }
};
