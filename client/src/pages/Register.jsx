import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/auth/authSlice";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert("Error");
    }

    if (isSuccess || user) {
      navigate("/");
    }
  }, [user, isError, isSuccess, navigate, message, dispatch]);

  if (isLoading) {
    //Add Spinner Here...
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // console.log(formData);
  };

  //Enter Role Field Also To Add Role in the DB...
  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      window.alert("Enter All Fields...");
    } else {
      const user = {
        name,
        email,
        password,
      };
      dispatch(register(user));
    }
  };

  return (
    <>
      <div className="register-label">
        <h1>Register</h1>
      </div>
      <div className="register-page">
        <div className="form">
          <form className="register-form" onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="name"
              onChange={onChange}
            />
            <input
              type="text"
              name="email"
              value={email}
              placeholder="email address"
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              value={password}
              placeholder="password"
              onChange={onChange}
            />
            <select name="role" id="role">
              <option value="">You are</option>
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
