import { useState, useEffect } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdSwapHoriz } from 'react-icons/md';
import { Link } from 'react-router-dom';

const currencyList = ["AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK", "EUR","GBP","HKD","HRK","HUF","IDR","ILS","INR","ISK", "JPY","KRW","MXN","MYR","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","USD","ZAR"];

const CurrencyExchange = () => {
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null); 
  const [lastUpdated, setLastUpdated] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const fetchExchangeRate = async () => {
    try {
      setError(null);
      // Construct the URL API key as a query parameter
      const res = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_yOtFE43XfRgmVUvD08oJ7MEbeML5hhqWofTKaQN6&base_currency=${fromCurrency}&currencies=${toCurrency}`);

      if (!res.ok) {
        const errorData = await res.json(); // Try to get more detailed error from API
        throw new Error(`HTTP error! status: ${res.status} - ${errorData.message || res.statusText}`);
      }
      const data = await res.json();

      // Access the conversion rate correctly from the 'data' object
      const conversionRate = data?.data?.[toCurrency];
      if (!conversionRate) {
        throw new Error('Rate not found in response. Check base and target currencies.');
      }

      setRate(conversionRate);
      setConvertedAmount((parseFloat(amount) * conversionRate).toFixed(4));
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching rate:', err);
      setError(`Failed to fetch exchange rate: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (rate !== null) {
      setConvertedAmount((parseFloat(amount) * rate).toFixed(4));
    }
  }, [amount, rate]);

  const handleNumberClick = (value) => {
    if (value === '.' && amount.includes('.')) 
      return;
    setAmount((prev) => (prev === '0' ? value : prev + value));
  };

  const handleClear = () => setAmount('0');
  const handleBackspace = () => setAmount((prev) => prev.slice(0, -1) || '0');
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setAmount('1');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (key.startsWith("F") || ["Tab", "CapsLock", "Shift", "Alt", "Meta"].includes(key)) {
        e.preventDefault();
        return;
      }

      if (/[0-9]/.test(key)) {
        handleNumberClick(key);
      }else if (key === ".") {
        handleNumberClick(key);
      }
       else if (key === "Backspace") {
        setAmount((prev) => prev.slice(0, -1))
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        setAmount("0");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [amount]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#1C1C1C] to-[#505050] gap-2">
      <div className="relative bg-black w-[286px] h-[500px] text-white rounded-[20px] flex flex-col px-5">
        <div className='my-4 flex justify-between items-center'>
          <div className='flex font-semibold items-center gap-2'>
            <Link to="/">
              <FaArrowLeftLong />
            </Link>
            Currency Converter</div>
          <div className='relative'>
            <BsThreeDotsVertical onClick={() => setShowMenu(!showMenu)} className='cursor-pointer' />
            {showMenu && (
              <div className='absolute right-0 mt-2 bg-[#1C1C1C] text-sm p-2 rounded shadow'>
                <div
                  onClick={() => {
                    fetchExchangeRate(); // Call the function to update the rate
                    setShowMenu(false); // Close the menu
                  }}
                  className='w-[140px] cursor-pointer hover:text-[#FF9500]'
                >
                  Update Exchange Rate
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-red-400 text-sm text-center mb-2">{error}</div>}

        <div className='flex justify-between mb-1'>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencyList.map((cur) => 
            <option key={cur} value={cur}>{cur}</option>
          )}
          </select>
          <div className='flex flex-col text-end'>
            <div>{amount}</div>
            <div className='text-[12px] text-[#505050]'>{fromCurrency}</div>
          </div>
        </div>

        <div className='text-center my-1'>
          <MdSwapHoriz onClick={handleSwap} className="inline-block text-2xl cursor-pointer text-[#FF9500]" />
        </div>

        <div className='flex justify-between'>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencyList.map((cur) =>
               <option key={cur} value={cur}>{cur}</option>
               )}
          </select>
          <div className='flex flex-col text-end'>
            <div>{convertedAmount}</div>
            <div className='text-[12px] text-[#505050]'>{toCurrency}</div>
          </div>
        </div>

        {lastUpdated && (
          <div className='text-[11px] text-[#808080] text-center mt-2'>Last updated: {lastUpdated}</div>
        )}

        <div className='flex absolute bottom-5 gap-3'>
          <div className='text-3xl grid grid-cols-3 gap-3'>
            {["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."].map((val) => (
              <div key={val} onClick={() => handleNumberClick(val)} className='bg-[#1C1C1C] rounded-full h-[55px] w-[55px] flex justify-center items-center cursor-pointer'>{val}</div>
            ))}
          </div>
          <div className='text-3xl grid grid-cols-1 gap-3'>
            <div onClick={handleClear} className='row-span-2 bg-[#FF9500] flex items-center justify-center cursor-pointer text-xl px-3 rounded-[20px]'>AC</div>
            <div onClick={handleBackspace} className='row-span-2 bg-[#FF9500] flex items-center justify-center cursor-pointer text-xl px-3 rounded-[20px]'>⌫</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExchange;
