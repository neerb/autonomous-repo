import './Display.css';

const Display = ({ value }) => {
  return (
    <div className="calculator-display">
      {value}
    </div>
  );
};

export default Display;