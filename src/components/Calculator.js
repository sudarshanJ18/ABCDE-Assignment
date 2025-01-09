import React, { useState } from "react";
import Button from "./Button";
import Display from "./Display";
import "./Calculator.css";
import { evaluate, sqrt, log10, log, pow, factorial, sin, cos, tan, sinh, cosh, tanh, exp } from "mathjs";

const Calculator = () => {
  const [value, setValue] = useState("0");
  const [memory, setMemory] = useState(0);
  const [isSecondFunction, setIsSecondFunction] = useState(false);
  const [isRadian, setIsRadian] = useState(true);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [previousValue, setPreviousValue] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const convertToRadian = (degree) => (degree * Math.PI) / 180;

  const handleMemoryFunction = (label) => {
    const num = parseFloat(value);

    switch (label) {
      case "mc":
        setMemory(0);
        break;
      case "mr":
        setValue(memory.toString());
        break;
      case "m+":
        setMemory((prev) => prev + num);
        break;
      case "m-":
        setMemory((prev) => prev - num);
        break;
      default:
        setValue("Error");
    }
  };

  const calculateResult = (operation, num) => {
    try {
      const input = isRadian ? num : convertToRadian(num);
      let result;

      switch (operation) {
        case "x²":
          result = Math.pow(num, 2);
          break;
        case "x³":
          result = Math.pow(num, 3);
          break;
        case "²√x":
          result = sqrt(num);
          break;
        case "³√x":
          result = Math.cbrt(num);
          break;
        case "x!":
          result = factorial(num);
          break;
        case "eˣ":
          result = exp(num);
          break;
        case "10ˣ":
          result = pow(10, num);
          break;
        case "1/x":
          result = 1 / num;
          break;
        case "ln":
          result = log(num);
          break;
        case "log₁₀":
          result = log10(num);
          break;
        case "sin":
          result = sin(input);
          break;
        case "cos":
          result = cos(input);
          break;
        case "tan":
          result = tan(input);
          break;
        case "sinh":
          result = sinh(input);
          break;
        case "cosh":
          result = cosh(input);
          break;
        case "tanh":
          result = tanh(input);
          break;
        default:
          return "Error";
      }
      return result.toString();
    } catch {
      return "Error";
    }
  };

  const handleScientificFunction = (label) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setValue("Error");
      return;
    }

    if (isSecondFunction) {
      const result = calculateResult(label, num);
      setValue(result);
      setWaitingForSecondOperand(false);
      setPreviousValue(null);
      setSelectedOperation(null);
    } else {
      const result = calculateResult(label, num);
      setValue(result);
    }
  };

  const handleSpecialFunction = (label) => {
    switch (label) {
      case "π":
        setValue(Math.PI.toString());
        setWaitingForSecondOperand(true);
        break;
      case "e":
        setValue(Math.E.toString());
        setWaitingForSecondOperand(true);
        break;
      case "Rand":
        setValue(Math.random().toString());
        setWaitingForSecondOperand(true);
        break;
      case "Rad":
        setIsRadian(!isRadian);
        // Display current mode briefly
        const currentMode = !isRadian ? "RAD" : "DEG";
        const currentValue = value;
        setValue(currentMode);
        setTimeout(() => setValue(currentValue), 500);
        break;
      default:
        break;
    }
  };

  const handleButtonClick = (label) => {
    if (["mc", "mr", "m+", "m-"].includes(label)) {
      handleMemoryFunction(label);
    } else if (label === "C") {
      setValue("0");
      setWaitingForSecondOperand(false);
      setPreviousValue(null);
      setSelectedOperation(null);
    } else if (label === "=") {
      try {
        if (previousValue !== null && selectedOperation !== null) {
          const result = calculateResult(selectedOperation, parseFloat(value));
          setValue(result);
          setPreviousValue(null);
          setSelectedOperation(null);
        } else {
          setValue(evaluate(value).toString());
        }
      } catch {
        setValue("Error");
      }
    } else if (label === "2nd") {
      setIsSecondFunction((prev) => !prev);
    } else if (label === "±") {
      setValue((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
    } else if (label === "%") {
      setValue((prev) => (parseFloat(prev) / 100).toString());
    } else if (label === "EE") {
      setValue((prev) => prev + "e");
    } else if (["π", "e", "Rand", "Rad"].includes(label)) {
      handleSpecialFunction(label);
    } else if ([
      "x²", "x³", "²√x", "³√x", "ln", "log₁₀", "x!", 
      "sin", "cos", "tan", "sinh", "cosh", "tanh",
      "eˣ", "10ˣ", "1/x"
    ].includes(label)) {
      handleScientificFunction(label);
    } else if (label === "ʸ√x") {
      setValue((prev) => prev + ",");
    } else {
      if (waitingForSecondOperand) {
        setValue(label);
        setWaitingForSecondOperand(false);
      } else {
        setValue((prev) => (prev === "0" ? label : prev + label));
      }
    }
  };

  const scientificButtons = [
    "(", ")", 
    "mc", "m+", "m-", "mr",
    "C", "±", "%", "/",
    "2nd", "x²", "x³", "xʸ", "eˣ", "10ˣ",
    "7", "8", "9", "*",
    "1/x", "²√x", "³√x", "ʸ√x", "ln", "log₁₀",
    "4", "5", "6", "-",
    "x!", "sin", "cos", "tan", "e", "EE",
    "1", "2", "3", "+",
    "Rad", "sinh", "cosh", "tanh", "π", "Rand",
    "0", ".", "=",
  ];

  return (
    <div className="calculator">
      <Display value={value} />
      <div className="buttons">
        <div className="scientific-section">
          {scientificButtons.map((btn, idx) => (
            <Button
              key={idx}
              label={btn}
              onClick={handleButtonClick}
              isZero={btn === "0"}
              isOperator={["/", "*", "-", "+", "="].includes(btn)}
              isScientific={[
                "sin", "cos", "tan", "ln", "log₁₀", "x!", "e", "π",
                "²√x", "³√x", "1/x", "x²", "x³", "xʸ", "eˣ", "10ˣ",
                "sinh", "cosh", "tanh", "ʸ√x", "Rand", "Rad", "(", ")", "%", "EE", "2nd", "C", "±", "mc", "m+", "m-", "mr",
              ].includes(btn)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;