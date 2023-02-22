import React, { useState } from "react";
import styles from "../pages/register.css";
import axios from "axios";
// import { Link } from "react-router-dom";
// import Form from "react-bootstrap/Form";

function Register() {

  const [formData, setFormData] = useState({
    name : '',
    email : '',
    password : '',
  })

  const {name, email, password} = formData;

  const onChange = (e) =>{
    setFormData((prevState) =>({
        ...prevState,
        [e.target.name] : e.target.value
    }));

    console.log(formData);
};

//Enter Role Field Also To Add Role in the DB...
const onSubmit = (e) => {
  e.preventDefault();

  if(!name || !email || !password){
    window.alert("Enter All Fields...");
  } else{
    const user = {
      name, email, password
    }

  }
}

  return (
    <>
      <div className="register-label">
        <h1>Register</h1>
      </div>
      <div className="register-page">
        <div className="form">
          <form className="register-form" onSubmit={onSubmit}>
            <input type="text" name="name" value={name} placeholder="name" onChange={onChange}/>
            <input type="text" name="email" value={email} placeholder="email address" onChange={onChange}/>
            <input type="password" name="password" value={password} placeholder="password" onChange={onChange}/>
            <select name="role"  id="role" >
              <option value="" >
                You are
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
