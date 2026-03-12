/**
 * Perform arithmetic operations with floating-point precision handling
 */
export const calculate = (operand1, operator, operand2) => {
  const a = parseFloat(operand1);
  const b = parseFloat(operand2);
  
  if (isNaN(a) || isNaN(b)) {
    return 'Error';
  }
  
  let result;
  
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) {
        return 'Error';
      }
      result = a / b;
      break;
    default:
      return 'Error';
  }
  
  // Round to 10 significant digits to handle floating-point precision
  return parseFloat(result.toPrecision(10));
};

/**
 * Format display value with appropriate precision
 */
export const formatDisplay = (value) => {
  if (value === 'Error') return value;
  
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  
  // Handle very large or very small numbers with scientific notation
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }
  
  // Limit display to 12 characters
  const str = num.toString();
  if (str.length > 12) {
    return parseFloat(num.toPrecision(10)).toString();
  }
  
  return str;
};