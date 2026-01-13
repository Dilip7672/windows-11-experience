import React, { useState, useCallback } from 'react';
import { Delete } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const backspace = useCallback(() => {
    if (display.length === 1 || (display.length === 2 && display[0] === '-')) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  }, [display]);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
      setHistory(`${display} ${nextOperation}`);
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      let result: number;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          result = inputValue;
      }

      const resultStr = String(result);
      setDisplay(resultStr);
      setPreviousValue(resultStr);
      setHistory(`${resultStr} ${nextOperation}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, operation, previousValue]);

  const calculate = useCallback(() => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    const currentValue = parseFloat(previousValue);
    let result: number;

    switch (operation) {
      case '+':
        result = currentValue + inputValue;
        break;
      case '-':
        result = currentValue - inputValue;
        break;
      case '×':
        result = currentValue * inputValue;
        break;
      case '÷':
        result = inputValue !== 0 ? currentValue / inputValue : 0;
        break;
      default:
        result = inputValue;
    }

    setHistory(`${previousValue} ${operation} ${display} =`);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, operation, previousValue]);

  const Button = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'default' 
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string;
    variant?: 'default' | 'operator' | 'equals' | 'function';
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "h-12 sm:h-14 rounded-lg font-medium transition-all duration-150 active:scale-95",
        variant === 'default' && "bg-secondary/50 hover:bg-secondary text-foreground",
        variant === 'operator' && "bg-secondary hover:bg-secondary/80 text-primary",
        variant === 'equals' && "bg-primary hover:bg-primary/90 text-primary-foreground",
        variant === 'function' && "bg-secondary/30 hover:bg-secondary/50 text-muted-foreground",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-background p-3 sm:p-4">
      {/* Display */}
      <div className="bg-secondary/30 rounded-xl p-4 mb-3">
        <div className="text-right text-xs text-muted-foreground h-4 truncate">
          {history}
        </div>
        <div className="text-right text-3xl sm:text-4xl font-light mt-1 truncate">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <Button onClick={clearEntry} variant="function">CE</Button>
        <Button onClick={clear} variant="function">C</Button>
        <Button onClick={backspace} variant="function">
          <Delete className="w-4 h-4 mx-auto" />
        </Button>
        <Button onClick={() => performOperation('÷')} variant="operator">÷</Button>

        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button onClick={() => performOperation('×')} variant="operator">×</Button>

        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <Button onClick={() => performOperation('-')} variant="operator">−</Button>

        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button onClick={() => performOperation('+')} variant="operator">+</Button>

        <Button onClick={toggleSign}>±</Button>
        <Button onClick={() => inputDigit('0')}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button onClick={calculate} variant="equals">=</Button>
      </div>
    </div>
  );
}
