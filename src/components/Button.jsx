import './Button.css';

const Button = ({ value, onClick, type = 'number' }) => {
  return (
    <button 
      className={`calculator-button calculator-button--${type}`}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};

export default Button;