import React, { useState } from "react";
import "./login.css";

function Login() {
  const [formData, setFormData] = useState({
    email : '',
    password : ''
  });

  const {email, password} = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value
    })) 
  }

  return (
    <>
      <div className="register-label">
        <h1>Login</h1>
      </div>
      <div className="login-page">
        <div className="form">
          <form className="register-form">
            <input type="text" name="email" placeholder="email address" onChange={onChange}/>
            <input type="password" name="password" placeholder="password" onChange={onChange}/>
            <button>Log In </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
