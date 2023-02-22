import React from "react";
import "./login.css";

function Login() {
  return (
    <>
      <div className="register-label">
        <h1>Login</h1>
      </div>
      <div className="login-page">
        <div className="form">
          <form className="register-form">
            <input type="text" placeholder="email address" />
            <input type="password" placeholder="password" />
            <button>Log In </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
