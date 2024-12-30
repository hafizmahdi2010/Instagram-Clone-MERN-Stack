import React, { useState } from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

const SignUp = () => {

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    fetch(api_base_url + "/signUp",{
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        name,
        email,
        pwd
      })
    }).then(res=>res.json()).then(data=>{
      if(data.success){
        navigate("/login");
      }
      else{
        toast.error(data.msg);
      }
    })
  }

  return (
    <>
      <div className="con flex items-center h-screen justify-center flex-col">
        <form onSubmit={submitForm} className='w-full px-[10px] flex flex-col items-center justify-center'>
          <img className='w-[150px] object-cover mb-8' src={logo} alt="" />

          <div className="inputBox">
            <input onChange={(e)=>{setUsername(e.target.value)}} value={username} type="text" placeholder='Username' required/>
          </div>

          <div className="inputBox">
            <input onChange={(e)=>{setName(e.target.value)}} value={name} type="text" placeholder='Name' required/>
          </div>

          <div className="inputBox">
            <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type="email" placeholder='Email' required/>
          </div>

          <div className="inputBox">
            <input onChange={(e)=>{setPwd(e.target.value)}} value={pwd} type="password" placeholder='Password' required/>
          </div>

          <p className='text-[14px] text-[gray] self-start'>Alredy have an account <Link to="/login" className='text-[#3797EF]'>Login</Link></p>

          <button className="btnNormal w-full mt-4" type="submit">Sign Up</button>
        </form>
      </div>
    </>
  )
}

export default SignUp