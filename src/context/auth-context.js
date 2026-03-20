import { createContext, useContext, useReducer } from "react";
import { authReducer } from "../reducer";

const initialValue = {
  isAuthModalOpen: false,
  isDropDownModalOpen: false,
  username: "",
  number: "",
  email: "",
  password: "",
  confirmPassword: "",
  accessToken: localStorage.getItem("accessToken") || "",
  name: localStorage.getItem("username") || "",
  role: localStorage.getItem("role") || "",
  selectedTab: "login",
};

const AuthContext = createContext(initialValue);

const AuthProvider = ({ children }) => {
  const [
    {
      isAuthModalOpen,
      isDropDownModalOpen,
      username,
      email,
      password,
      number,
      accessToken,
      name,
      role,
      selectedTab,
      confirmPassword,
    },
    authDispatch,
  ] = useReducer(authReducer, initialValue);

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        isDropDownModalOpen,
        username,
        email,
        password,
        number,
        accessToken,
        name,
        role,
        selectedTab,
        confirmPassword,
        authDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
