import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (username.length < 5) {
            alert("Username must be at least 5 characters long!");
            return;
        }
        if (password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }
        // Password allowed characters check
        if (!/^([a-zA-Z0-9_]+)$/.test(password)) {
            alert("Password can only contain letters, numbers, and underscores (_)");
            return;
        }
        // Email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Invalid email address!");
            return;
        }
        try {
            const response = await fetch("http://localhost:5174/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Signup successful
                navigate("/login");
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            alert("Server error");
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#3e2145]">
            <div className="bg-[#854F6C] rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-2 text-[#DFB6B2]">Sign Up</h1>
                <p className="mb-6 text-[#FBE4D8] text-sm">Make your to-do list easily</p>
                <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
                    <input
                        type="text"
                        required
                        placeholder="Username"
                        className="border-b border-[#190019] px-4 py-2 text-[#FBE4D8] focus:outline-none"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        className="border-b border-[#190019] px-4 py-2 text-[#FBE4D8] focus:outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
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
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            placeholder="Confirm Password"
                            className="border-b border-[#190019] px-4 py-2 text-[#FBE4D8] focus:outline-none w-full"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#DFB6B2] cursor-pointer select-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <IoMdEyeOff /> : <FaEye />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#1900198f] text-[#FBE4D8] font-bold py-2 rounded-3xl mt-2 hover:bg-[#3e2145] transition"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-6 text-center flex gap-1">
                    <span className="text-[#DFB6B2]">Already have an account?</span>
                    <span className="text-[#190019] hover:underline cursor-pointer"
                        onClick={() => navigate("/login?type=username")}>Log in</span>
                </div>
            </div>
        </div>
    );
};

export default Signup; 