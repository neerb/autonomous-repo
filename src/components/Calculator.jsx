import { useState, useEffect } from 'react';
import Display from './Display';
import Button from './Button';
import { calculate, formatDisplay } from '../utils/calculator';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [operand, setOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Handle number button clicks
  const handleNumberClick = (num) => {
    if (display === 'Error') {
      return; // Require clear to recover from error
    }

    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  // Handle decimal point
  const handleDecimalClick = () => {
    if (display === 'Error') {
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Handle operator button clicks
  const handleOperatorClick = (nextOperator) => {
    if (display === 'Error') {
      return;
    }

    const inputValue = parseFloat(display);

    if (operand === null) {
      setOperand(inputValue);
    } else if (operator) {
      const result = calculate(operand, operator, inputValue);
      setDisplay(formatDisplay(result));
      setOperand(result === 'Error' ? null : result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  // Handle equals button
  const handleEqualsClick = () => {
    if (display === 'Error' || operator === null) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = calculate(operand, operator, inputValue);
    
    setDisplay(formatDisplay(result));
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  // Handle clear button
  const handleClearClick = () => {
    setDisplay('0');
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      if (key >= '0' && key <= '9') {
        handleNumberClick(key);
      } else if (key === '.') {
        handleDecimalClick();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault(); // Prevent browser shortcuts
        handleOperatorClick(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEqualsClick();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClearClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, operand, operator, waitingForOperand]);

  return (
    <div className="calculator">
      <Display value={display} />
      <div className="calculator-buttons">
        <Button value="C" onClick={handleClearClick} type="action" />
        <Button value="/" onClick={handleOperatorClick} type="operator" />
        <Button value="*" onClick={handleOperatorClick} type="operator" />
        <Button value="-" onClick={handleOperatorClick} type="operator" />
        
        <Button value="7" onClick={handleNumberClick} type="number" />
        <Button value="8" onClick={handleNumberClick} type="number" />
        <Button value="9" onClick={handleNumberClick} type="number" />
        <Button value="+" onClick={handleOperatorClick} type="operator" />
        
        <Button value="4" onClick={handleNumberClick} type="number" />
        <Button value="5" onClick={handleNumberClick} type="number" />
        <Button value="6" onClick={handleNumberClick} type="number" />
        
        <Button value="1" onClick={handleNumberClick} type="number" />
        <Button value="2" onClick={handleNumberClick} type="number" />
        <Button value="3" onClick={handleNumberClick} type="number" />
        <Button value="=" onClick={handleEqualsClick} type="equals" />
        
        <Button value="0" onClick={handleNumberClick} type="number" />
        <Button value="." onClick={handleDecimalClick} type="number" />
      </div>
    </div>
  );
};

export default Calculator;