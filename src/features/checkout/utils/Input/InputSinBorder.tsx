import React, { useState, useRef } from "react";
import { useAppContext } from "../../../../context/AppContext";

type Validator = (value: string) => string | null;

interface InputSinBorderProps {
  label: string;
  value: string;
  name: string;
  onChange: (name: string, value: string) => void;
  validators?: Validator[];
  error?: string | null;
  placeholder?: string;
  type?: string;
}

export const InputSinBorder: React.FC<InputSinBorderProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { states } = useAppContext();

  const showFloatingLabel = isFocused || value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    onChange(name, onlyNumbers);
  };

  return (
    <div className="relative" style={{ color: states.textColorform }}>
      {/* Label flotante */}
      <label
        className={`absolute left-2 px-1 transition-all bg-transparent ${
          showFloatingLabel ? "text-xs -top-2 " : "top-6"
        } pointer-events-none z-10`}
        htmlFor={name}
      >
        {label}
      </label>

      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        className={`border-b p-2 pt-5 w-full bg-transparent h-12 outline-none hover:border-b-4 ${
          error
            ? "border-red-500 hover:border-b-red-500 error"
            : "border-gray-300"
        } focus:outline-none focus:border-blue-500`}
        style={
          {
            "--hover-color": states.inputHoverColor,
            "--focus-color": states.inputHoverColor,
          } as React.CSSProperties
        }
      />

      {error && <p className="absolute text-red-500 text-sm">{error}</p>}
    </div>
  );
};
