import React from "react";
import "./Button.css";

const Button = ({ label, onClick, isZero, isOperator, isScientific }) => {
  let buttonClass = "";

  if (["/", "*", "-", "+", "="].includes(label)) {
    buttonClass = "operator-button";
  } else if (isZero) {
    buttonClass = "zero-button";
  } else if (isOperator) {
    buttonClass = "operator-button";
  } else if (isScientific) {
    buttonClass = "scientific-button";
  } else {
    buttonClass = "number-button"; 
  }

  return (
    <button
      className={`button ${buttonClass}`}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

export default Button;
