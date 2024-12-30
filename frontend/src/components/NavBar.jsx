import React from 'react'
import logo from "../images/logo.png"
import { FaRegHeart } from "react-icons/fa6";
import { AiOutlineMessage } from "react-icons/ai";

const NavBar = () => {
  return (
    <>
      <div className="nav p-[10px] py-[20px] flex items-center justify-between">
        <img className='w-[100px] object-cover' src={logo} alt="" />

        <div className="flex items-center gap-[15px]">
          <i className='text-[22px] cursor-pointer'><FaRegHeart /></i>
          <i className='text-[22px] cursor-pointer'><AiOutlineMessage /></i>
        </div>
      </div>
    </>
  )
}

export default NavBar