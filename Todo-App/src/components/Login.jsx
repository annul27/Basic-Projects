import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const params = new URLSearchParams(location.search);
    const defaultType = params.get("type") === "username" ? "username" : "email";

    const [loginType, setLoginType] = useState(defaultType);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5174/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrUsername, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Save user info to localStorage
                localStorage.setItem("user", JSON.stringify({
                    username: data.username,
                    email: data.email,
                    token: data.token // optional, for authentication
                }));
                navigate("/");
            } else {
                alert(data.message || "Login failed");
            } 
        } catch (error) {
            alert("Server error");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#3e2145]">
            <div className="bg-[#854F6C] rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-2 text-[#DFB6B2]">Login</h1>
                <form className="w-full flex flex-col" onSubmit={handleLogin}>
                    <input
                        type={loginType === "email" ? "email" : "text"}
                        required
                        placeholder={loginType === "email" ? "Email" : "Username"}
                        className="border-b border-[#190019] px-4 py-2 text-[#FBE4D8] focus:outline-none"
                        value={emailOrUsername}
                        onChange={e => setEmailOrUsername(e.target.value)}
                    />
                    <div className="px-4 pb-4 text-sm flex gap-1">
                        <span className="text-[#190019]">Login with</span>
                        <span
                            className="text-[#DFB6B2] cursor-pointer hover:underline"
                            onClick={() => setLoginType(loginType === "email" ? "username" : "email")}
                        >
                            {loginType === "email" ? "username" : "email"}
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Password"
                            className="border-b border-[#190019] px-4 py-2 text-[#FBE4D8] focus:outline-none w-full"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#DFB6B2] cursor-pointer select-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <IoMdEyeOff /> : <FaEye />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#1900198f] text-[#FBE4D8] font-bold py-2 rounded-3xl mt-2 hover:bg-[#3e2145] transition"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center flex gap-1">

                    <span className="text-[#DFB6B2]">Don't have an account?</span>
                    <span className="text-[#190019] hover:underline cursor-pointer"
                        onClick={() => navigate("/signup")}>Sign Up</span>
                </div>
            </div>
        </div>
    );
};

export default Login;