import { create, all } from 'mathjs';
import { RxCross2 } from 'react-icons/rx';
import { RiSubtractFill } from 'react-icons/ri';
import { IoMdAdd } from 'react-icons/io';
import { HiEquals } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import Features from './features';


const math = create(all);

const Scientific = () => {
  const [count, setCount] = useState("");
  const [result, setResult] = useState("0");
  const [isInverse, setIsInverse] = useState(false);
  const [angleMode, setAngleMode] = useState('DEG'); // 'DEG' or 'RAD'

  // Configure mathjs based on angleMode for evaluate()
  useEffect(() => {
    math.config({
      unit: angleMode === 'DEG' ? 'deg' : 'rad'
    });
  }, [angleMode]);

  const endsWithNumberOrParen = (str) => {
    if (!str) return false;
    const lastChar = str[str.length - 1];
    return /[0-9)]/.test(lastChar);
  };

  const handleClick = (value) => {
    try {
      if (value === "AC") {
        setCount("");
        setResult("0");
        setIsInverse(false);
        setAngleMode('DEG'); 
      } else if (value === "INV") {
        setIsInverse(prev => !prev);
      } else if (value === "DEG_RAD_TOGGLE") {
        setAngleMode(prev => {
          const newMode = prev === 'DEG' ? 'RAD' : 'DEG';
          return newMode;
        });
      }
      else if (value === "=") {
        if (count.trim() === "") return;

        let expressionToEvaluate = count.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");

        
        if (angleMode === 'DEG') {
            
            const trigRegex = /(sin|cos|tan|asin|acos|atan)\(([^)]+)\)/g;

            expressionToEvaluate = expressionToEvaluate.replace(trigRegex, (match, funcName, arg) => {
               
               
                return `${funcName}(${arg} deg)`;
            });
        }

        
        let evaluated;
        try {
            evaluated = math.evaluate(expressionToEvaluate);
        } catch (evalError) {
            console.error("[Eval] Error evaluating expression:", evalError);
            setResult("Error");
            setCount("");
            return;
        }

        let finalResult;
        if (math.isUnit(evaluated)) {
            if (angleMode === 'DEG') {
                finalResult = evaluated.toNumber('deg');
            } else {
                finalResult = evaluated.toNumber('rad');
            }
            console.log(`[Eval] Evaluated result was a unit. Converted to number: ${finalResult} in ${angleMode}`);
        } else {
            finalResult = evaluated;
            console.log(`[Eval] Evaluated result was a number: ${finalResult}`);
        }

        setResult(finalResult.toString());
        setCount(finalResult.toString());
        setIsInverse(false);
      } else if (['sin', 'cos', 'tan', 'ln', 'log', 'x!', 'sqrt', 'x^2', 'x^y', 'pi', 'e', '(', ')'].includes(value)) {
        let valToOperateOn = result !== "0" && result !== "" ? result : count;
        let numericValue = parseFloat(valToOperateOn);

        if (isNaN(numericValue) && !['pi', 'e', '(', ')', 'x^y'].includes(value)) {
          setCount(prev => prev + value + "(");
          setResult("");
          return;
        }

        let calculatedValue;

        switch (value) {
          case 'sin':
            // THIS IS THE CRITICAL SECTION FOR DEGREES CONVERSION
            if (angleMode === 'DEG') {
                numericValue = numericValue * (Math.PI / 180); // Convert degrees to radians for mathjs input
            }
            calculatedValue = isInverse ? math.asin(numericValue) : math.sin(numericValue);
            console.log(`Result from math.sin/asin (raw): ${calculatedValue}`);

            // If inverse AND in DEG mode, convert the resulting angle (from radians) back to degrees
            if (isInverse && angleMode === 'DEG') {
                calculatedValue = calculatedValue * (180 / Math.PI);
            }
            break;
          case 'cos':
            if (angleMode === 'DEG') {
                numericValue = numericValue * (Math.PI / 180);
            }
            calculatedValue = isInverse ? math.acos(numericValue) : math.cos(numericValue);
            console.log(`Result from math.cos/acos (raw): ${calculatedValue}`);
            if (isInverse && angleMode === 'DEG') {
                calculatedValue = calculatedValue * (180 / Math.PI);
            }
            break;
          case 'tan':
            if (angleMode === 'DEG') {
                numericValue = numericValue * (Math.PI / 180);
            }
            calculatedValue = isInverse ? math.atan(numericValue) : math.tan(numericValue);
            if (isInverse && angleMode === 'DEG') {
                calculatedValue = calculatedValue * (180 / Math.PI);
            }
            break;
          case 'ln':
            calculatedValue = isInverse ? math.exp(numericValue) : math.log(numericValue);
            break;
          case 'log':
            calculatedValue = isInverse ? math.pow(10, numericValue) : math.log10(numericValue);
            break;
          case 'x!':
            calculatedValue = math.factorial(numericValue);
            break;
          case 'sqrt':
            calculatedValue = math.sqrt(numericValue);
            break;
          case 'x^2':
            calculatedValue = math.pow(numericValue, 2);
            break;
          case 'pi':
            const piValue = math.pi.toString();
            if (endsWithNumberOrParen(count)) {
              setCount(prev => prev + '*' + piValue);
            } else {
              setCount(prev => prev + piValue);
            }
            setResult("");
            return;
          case 'e':
            const eValue = math.e.toString();
            if (endsWithNumberOrParen(count)) {
              setCount(prev => prev + '*' + eValue);
            } else {
              setCount(prev => prev + eValue);
            }
            setResult("");
            return;
          case '(':
            if (endsWithNumberOrParen(count) || count.endsWith(math.pi.toString()) || count.endsWith(math.e.toString())) {
                setCount(prev => prev + '*(');
            } else {
                setCount(prev => prev + '(');
            }
            setResult("");
            return;
          case ')':
            setCount(prev => prev + ')');
            setResult("");
            return;
          case 'x^y':
            setCount(prev => prev + '^');
            setResult("");
            return;
          default:
            break;
        }

        
        setResult(calculatedValue.toString());
        setCount(calculatedValue.toString()); 
        setIsInverse(false);

      } else if (value === '%') {
        if (result !== "0" && result !== "") {
          const num = parseFloat(result);
          if (!isNaN(num)) {
            setResult((num / 100).toString());
            setCount((num / 100).toString());
          } else {
            setResult("Error");
            setCount("");
          }
        } else if (count !== "") {
          const lastNumberMatch = count.match(/(\d+\.?\d*)$/);
          if (lastNumberMatch) {
            const num = parseFloat(lastNumberMatch[1]);
            const newCount = count.slice(0, -lastNumberMatch[1].length) + (num / 100).toString();
            setCount(newCount);
            try {
              setResult(math.evaluate(newCount.replace(/×/g, "*").replace(/÷/g, "/")).toString());
            } catch (err) {
                console.error("Error evaluating percentage expression:", err);
            }
          } else {
            setCount(prev => prev + "%");
          }
        }
      } else {
        setCount((prev) => prev + value);
        setResult(""); // Clear result when new input starts building count
      }
    } catch (err) {
      console.error("Calculation Error (Caught by try-catch):", err);
      setResult("Error");
      setCount("");
      setIsInverse(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      // Prevent default for function keys and common modifier keys
      if (key.startsWith("F") || ["Tab", "CapsLock", "Shift", "Alt", "Meta", "Control"].includes(key)) {
        e.preventDefault();
        return;
      }
      // Handle numeric keys
      if (/[0-9]/.test(key)) {
        handleClick(key);
      }
      // Handle operators
      else if (key === "+" || key === "-" || key === ".") {
        handleClick(key);
      } else if (key === "*" || key.toLowerCase() === "x") {
        handleClick("×"); // Use '×' for display
      } else if (key === "/") {
        handleClick("÷"); // Use '÷' for display
      }
      // Handle Enter (equals)
      else if (key === "Enter") {
        e.preventDefault(); // Prevent new line in input fields
        handleClick("=");
      }
      // Handle Backspace
      else if (key === "Backspace") {
        setCount((prev) => prev.slice(0, -1));
        if (count.length === 1) setResult("0"); // If last char removed, reset result
      }
      // Handle Escape or 'c' (AC)
      else if (key === "Escape" || key.toLowerCase() === "c") {
        handleClick("AC");
      }
      // Handle percentage
      else if (key.toLowerCase() === "%") {
        handleClick("%");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, result]); // Dependencies for useEffect

  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-r from-[#1C1C1C] to-[#505050]'>
      <div className='w-[490px] h-[500px] bg-black rounded-[20px] flex flex-col text-white relative px-5 scientific'>
        <div className='w-full my-4 options'>
          <Features angleMode={angleMode} />
        </div>
        <div className="absolute bottom-5">
          <div className="flex flex-col transition-all duration-300 ease-in-out pb-2 output">
            <div className={`text-end transition-all duration-300 ease-in-out
              ${result !== "0" && result !== "" ? "text-[#D4D4D2] text-xl translate-y-[-10px] opacity-60" : "text-xl translate-y-0 opacity-100"}
              `}>
              {count}
            </div>
            {result !== "" && result !== "0" && (
              <div className="text-end text-xl text-white transition-opacity duration-300 ease-in-out opacity-100">
                {result}
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3 text-[12px]">
            <div className="grid grid-cols-3 gap-3 text-2xl">
              <div
                className={`bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer ${isInverse ? 'text-[#FF9500]' : ''}`}
                onClick={() => handleClick("INV")}
              >
                INV
              </div>
              <div
                className={`bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer ${angleMode === 'RAD' ? 'text-[#FF9500]' : ''}`}
                onClick={() => handleClick("DEG_RAD_TOGGLE")}
              >
                {angleMode}
              </div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("x!")}>x!</div>

              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("sin")}>{isInverse ? 'asin' : 'sin'}</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("cos")}>{isInverse ? 'acos' : 'cos'}</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("tan")}>{isInverse ? 'atan' : 'tan'}</div>

              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("ln")}>{isInverse ? 'eˣ' : 'ln'}</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("log")}>{isInverse ? '10ˣ' : 'log'}</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("x^y")}>x<sup className="font-bold">y</sup></div>

              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("pi")}>π</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("e")}>e</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("sqrt")}>√</div>

              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("(")}>(</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick(")")}>)</div>
              <div className="bg-[#1C1C1C] rounded-[50%] h-[55px] flex justify-center items-center w-[55px] cursor-pointer"
                   onClick={() => handleClick("x^2")}>x<sup>2</sup></div>
            </div>
            <div className='flex gap-3'>
              <div className='flex flex-col gap-3'>
                <div className='text-3xl grid grid-cols-3 gap-3'>
                  <div className="bg-[#D4D4D2] rounded-[50%] h-[55px] flex items-center justify-center text-black w-[55px] cursor-pointer" onClick={() => handleClick("AC")}>AC</div>
                  <div className="bg-[#D4D4D2] rounded-[50%] h-[55px] flex items-center justify-center text-black w-[55px] cursor-pointer" onClick={() => handleClick("%")}>%</div>
                  <div className="bg-[#D4D4D2] rounded-[50%] h-[55px] flex items-center justify-center text-black w-[55px] cursor-pointer" onClick={() => handleClick("÷")}>/</div>
                </div>
                <div className='text-3xl grid grid-cols-3 gap-3'>
                  {["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."].map((val) => (
                    <div key={val} onClick={() => handleClick(val)} className='bg-[#1C1C1C] rounded-full h-[55px] w-[55px] flex justify-center items-center cursor-pointer'>{val}</div>
                  ))}
                </div>
              </div>
              <div className='text-3xl grid grid-cols-1 gap-3'>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer text-xl"
                     onClick={() => setCount((prev) => prev.slice(0, -1) || "") || setResult("")}>⌫</div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("×")}><RxCross2 /></div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("-")}><RiSubtractFill /></div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("+")}><IoMdAdd /></div>
                <div className="bg-[#FF9500] rounded-[50%] h-[55px] w-[55px] flex items-center justify-center cursor-pointer" onClick={() => handleClick("=")}><HiEquals /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scientific;