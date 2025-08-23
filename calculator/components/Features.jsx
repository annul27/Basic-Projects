import { BsCurrencyExchange } from 'react-icons/bs';
import { TbSquareRoot2 } from 'react-icons/tb';
import { CiCalculator2 } from 'react-icons/ci';
import { Link } from 'react-router-dom';

const Features = ({ angleMode }) => { 
  const isScientific = location.pathname === '/Scientific';

  return (
    <div className='flex items-center justify-end gap-4'>
      {
        isScientific ? (
          <>
            <Link to="/">
              <span><CiCalculator2 /></span> 
            </Link>
            <Link to="/CurrencyExchange">
              <span><BsCurrencyExchange /></span>
            </Link>
            <span className='text-[12px] text-gray-400'>{angleMode}</span>
          </>
        ) : (
          <>
            <Link to="/Scientific">
              <span><TbSquareRoot2 /></span>
            </Link>
            <Link to="/CurrencyExchange">
              <span><BsCurrencyExchange /></span>
            </Link>
          </>
        )
      }
    </div>
  );
}

export default Features;