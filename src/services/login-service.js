import axios from "axios";

export const loginHandler = async (number, password, setAlert) => {
  try {
    const {
      data: { accessToken, username, role },
    } = await axios.post(
      "http://localhost:3200/api/auth/login",
      {
        number: number,
        password: password,
      }
    );
    console.log("Logged IN");
    console.log({ accessToken, username, role });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setAlert({
      open: true,
      message: "Login Successful!",
      type: "success"
    })
    return { accessToken, username, role };
  } catch (err) {
    console.log("unable to login");
  }
};
