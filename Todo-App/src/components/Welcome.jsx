import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Welcome = () => {
    const navigate = useNavigate();

    const handleGuest = () => {
        localStorage.setItem("user", JSON.stringify({ username: "Guest", email: "", password: "" }));
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#3e2145] ">
            <div className="bg-[#854F6C] rounded-xl shadow-lg p-8 w-full h-[50vh] max-w-sm flex flex-col items-center bg-[url('/welcome-pg.avif')] bg-cover bg-center opacity-90">
                <h1 className="text-2xl font-bold mb-2 text-[#DFB6B2]">Welcome</h1>
                <p className="mb-6 text-[#FBE4D8] text-sm">Your day planner buddy!</p>


                <span className="text-center bg-[#1900198f] text-[#FBE4D8] font-bold py-2 w-full rounded-3xl mt-2 hover:bg-[#3e2145] transition" onClick={() => navigate("/signup")}>Sign Up</span>
                <span className="text-center bg-[#1900198f] text-[#FBE4D8] font-bold py-2 w-full rounded-3xl mt-2 hover:bg-[#3e2145] transition" onClick={() => navigate("/login?type=username")}>Log In</span>


                <span className=' flex items-center justify-center gap-2 cursor-pointer bg-[#fff] font-black py-2 w-full mt-20 rounded-3xl hover:bg-[#3e2145] transition text-[#190019]'><span className='text-2xl'><FcGoogle /></span>Sign in with Google</span>
                <span className='flex justify-center items-center gap-2 cursor-pointer bg-[#1f1f1f] font-black py-2 w-full mt-2 rounded-3xl hover:bg-[#3e2145] transition text-[#fff]' onClick={handleGuest}>Continue as Guest<FaUser /></span>


            </div>
        </div>
    )
}

export default Welcome