import React from 'react'
import { FaRegPlusSquare } from 'react-icons/fa'
import { FaRegHeart, FaRegUser } from 'react-icons/fa6'
import { FiSearch } from 'react-icons/fi'
import { RiHome5Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const BottomNav = () => {
  const navigate = useNavigate(); 
  return (
    <>
      <div className="bottomNav flex items-center justify-between px-[15px] fixed bottom-0 left-0 right-0 w-screen h-[50px] bg-[#121212]">
        <i className='text-[23px] cursor-pointer' onClick={()=>{navigate("/")}}><RiHome5Line /></i>
        <i className='text-[23px] cursor-pointer'><FiSearch /></i>
        <i className='text-[23px] cursor-pointer' onClick={()=>{navigate("/create")}}><FaRegPlusSquare /></i>
        <i className='text-[23px] cursor-pointer'><FaRegHeart /></i>
        <i className='text-[23px] cursor-pointer' onClick={()=>{navigate("/profile/"+localStorage.getItem("userId"))}}><FaRegUser /></i>
      </div>
    </>
  )
}

export default BottomNav