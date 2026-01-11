import axios from "axios";

export const signupHandler = async (
  username,
  number,
  email,
  password,
  setAlert
) => {
  try {
    const { data } = await axios.post(
      "https://travel-app-backend-zvzh.onrender.com/api/auth/register",
      {
        username,
        number,
        email,
        password,
      }
    );

    setAlert({
      open: true,
      type: "success",
      message: data.message || `Account Created: username - ${data.username}`,
    });

  } catch (err) {
    console.error("Signup error:", err);

    if (err.response) {
      // Backend sent an error
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
      // Network / server down
      setAlert({
        open: true,
        type: "error",
        message: "Server not reachable. Try again later.",
      });
    }
  }
};
