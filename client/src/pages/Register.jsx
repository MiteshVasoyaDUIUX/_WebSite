import React from "react";
import styles from "../pages/register.css";
// import { Link } from "react-router-dom";
// import Form from "react-bootstrap/Form";

function Register() {


  return (
    <>
      <div className="register-label">
        <h1>Register</h1>
      </div>
      <div className="register-page">
        <div className="form">
          <form className="register-form">
            <input type="text" placeholder="name" />
            <input type="password" placeholder="password" />
            <input type="text" placeholder="email address" />
            <select name="role" id="role">
              <option value="" defaultValue>
                You are{" "}
              </option>
              <option value="vendor">Vendor</option>
              <option value="buyer">Buyer</option>
            </select>

            <button>Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
