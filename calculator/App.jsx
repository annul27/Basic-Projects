import { useState, useEffect } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { RiSubtractFill } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { HiEquals } from 'react-icons/hi2'
import { evaluate } from 'mathjs'

import Features from './components/features'

function App() {
  const [count, setCount] = useState("")
  const [result, setResult] = useState("0")


  const handleClick = (value) => {
    if (value === "AC") {
      setCount("")
      setResult("0")
    } else if (value === "=") {
      try {
        const evaluated = evaluate(count.replace(/×/g, "*").replace(/÷/g, "/"));
        setResult(evaluated.toString());
      } catch (err) {
        setResult("Error");
      }
    } else {
      setCount((prev) => prev + value);
      setResult("")  // Clear the result display on new input
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (key.startsWith("F") || ["Tab", "CapsLock", "Shift", "Alt", "Meta"].includes(key)) {
        e.preventDefault();
        return;
      }

      if (/[0-9]/.test(key)) {
        handleClick(key);
      } else if (key === "+" || key === "-" || key === ".") {
        handleClick(key);
      } else if (key === "*" || key.toLowerCase() === "x") {
        handleClick("×");
      } else if (key === "/") {
        handleClick("÷");
      } else if (key === "Enter") {
        if (count.trim() === "") return;

        try {
          const evaluated = evaluate(count.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100"));
          setResult(evaluated.toString());
        } catch (err) {
          setResult("Error");
        }
      } else if (key === "Backspace") {
        setCount((prev) => prev.slice(0, -1)) || setResult((prev) => prev.slice(0, -1))
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        setCount("");
        setResult("0");
      } else if (key.toLowerCase() === "%") {
        setResult((result) => count / 100)
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count]);

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#1C1C1C] to-[#505050] gap-2">

        <div className="relative bg-black w-[286px] h-[500px] text-white rounded-[20px] px-5">
          <div className='w-full my-4 '>
            <Features />
          </div>

          {/* Animated Expression & Result */}
          <div className='absolute bottom-5 '>

            <div className="flex flex-col transition-all duration-300 ease-in-out pb-2">
              {/* Expression */}
              <div className={`text-end pr-2.5 transition-all duration-300 ease-in-out
              ${result !== "0" && result !== "" ? "text-[#D4D4D2] text-xl translate-y-[-10px] opacity-60" : "text-xl translate-y-0 opacity-100"}
              `}>
                {count}
              </div>

              {/* Result */}
              {result !== "" && result !== "0" && (
                <div className="text-end text-xl text-white transition-opacity duration-300 ease-in-out opacity-100">
                  {result}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className='flex gap-3'>
              <div className='flex flex-col gap-3'>
                <div className='text-3xl grid grid-cols-3 gap-3'>
                  <div className="bg-[#D4D4D2] rounded-[50%] h-[55px] flex items-center justify-center  text-black w-[55px] cursor-pointer" onClick={() => handleClick("AC")}>AC</div>
                  <div className="bg-[#D4D4D2] rounded-[50%] h-[55px] flex items-center justify-center  text-black w-[55px] cursor-pointer" onClick={() => setResult((result) => count / 100)}>%</div>
                  <div className="bg-[#D4D4D2] rounded-[50%] h-[55px] flex items-center justify-center text-black w-[55px] cursor-pointer" onClick={() => handleClick("÷")}>/</div>
                </div>
                <div className='text-3xl grid grid-cols-3 gap-3'>
                  {["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."].map((val) => (
                    <div key={val} onClick={() => handleClick(val)} className='bg-[#1C1C1C] rounded-full h-[55px] w-[55px] flex justify-center items-center cursor-pointer'>{val}</div>
                  ))}
                </div>
              </div>
              <div className='text-3xl grid grid-cols-1 gap-3'>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer text-xl" onClick={() => setCount((prev) => prev.slice(0, -1)) || setResult((prev) => prev.slice(0, -1))}>⌫</div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("×")}><RxCross2/></div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("-")}><RiSubtractFill /></div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("+")}><IoMdAdd /></div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("=")}><HiEquals /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
