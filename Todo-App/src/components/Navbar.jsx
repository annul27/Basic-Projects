import React from 'react'
import Logo from './logo'
import { IoLogOut } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };
  return (
    <nav className='flex justify-between items-center p-4 bg-[#190019] text-[#FBE4D8]'>
      <div>
        <span>
          <div className='bg-[#8A8467] rounded-tl-xl rounded-br-xl p-1'>
            
          <Logo/>
          </div>
          </span>
      </div>
      <div className='flex space-x-4 items-center'>
        <span className='cursor-pointer hover:font-bold'>Home</span>
        <span className='cursor-pointer hover:font-bold'>Your Tasks</span>
        <span className='cursor-pointer text-2xl' onClick={handleLogout}><IoLogOut/></span>
      </div>
    </nav>
  )
}

export default Navbar
