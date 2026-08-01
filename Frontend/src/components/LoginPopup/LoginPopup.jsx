import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      let newUrl = url;

      if (currState === "Login") {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/register";
      }

      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);

        localStorage.setItem(
          "token",
          response.data.token
        );

        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  const switchState = () => {
    setCurrState((previousState) =>
      previousState === "Login"
        ? "Sign Up"
        : "Login"
    );

    setData({
      name: "",
      email: "",
      password: ""
    });
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={onLogin}
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            className="cross-icon"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={data.name}
              onChange={onChangeHandler}
              autoComplete="name"
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={data.email}
            onChange={onChangeHandler}
            autoComplete="email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            autoComplete={
              currState === "Login"
                ? "current-password"
                : "new-password"
            }
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : currState === "Sign Up"
              ? "Create account"
              : "Login"}
        </button>

        <div className="login-popup-condition">
          <input
            id="terms"
            type="checkbox"
            required
          />

          <label htmlFor="terms">
            By checking this box, you agree to our
            Terms of Service and Privacy Policy.
          </label>
        </div>

        <p className="login-popup-switch">
          {currState === "Login"
            ? "Create a new account?"
            : "Already have an account?"}

          <span onClick={switchState}>
            {currState === "Login"
              ? "Click here"
              : "Login here"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;