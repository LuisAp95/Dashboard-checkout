import React, { useState, useRef } from "react";
import { useAppContext } from "../../../../context/AppContext";

type Validator = (value: string) => string | null;

interface InputFieldProps {
  label: string;
  value: string;
  name: string;
  onChange: (name: string, value: string) => void;
  validators?: Validator[];
  error?: string | null;
  placeholder?: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
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
        style={{ backgroundColor: states.isBgFormulariocolor }}
        className={`absolute left-2 px-1 transition-all ${
          showFloatingLabel ? "text-xs -top-2" : " top-3"
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
        className={`border p-2 pt-5 w-full rounded-xl bg-transparent h-12 hover:border-b-4 ${
          error
            ? "border-red-500 hover:border-b-red-500 error"
            : "border-gray-300"
        } focus:outline-none active:bg-transparent autofill:bg-transparent focus:autofill:bg-transparent`}
        style={
          {
            color: states.textColorform,
            "--hover-color": states.inputHoverColor,
            "--focus-color": states.inputHoverColor,
          } as React.CSSProperties
        }
      />

      {error && <p className="absolute text-red-500 text-sm">{error}</p>}
    </div>
  );
};
