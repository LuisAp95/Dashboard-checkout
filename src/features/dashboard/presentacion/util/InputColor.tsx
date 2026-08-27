import { type ChangeEvent } from "react";
import { useAppContext } from "../../../../context/AppContext";

interface ColorInputProps {
  value: string;
  initialColor?: string;
  label: string;
  id: string;
  onChange: (color: string) => void;
}

export default function ColorInput({
  value,
  label,
  id,
  onChange,
}: ColorInputProps) {
  const { states } = useAppContext();
  
  // Determinar si el input debe estar deshabilitado basado en condiciones
  const isDisabled = states.selecteTemplate !== '1' && (
    id === "paymentTextColor" || 
    id === "paymentBgColor"
  );

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled) {
      const newColor = e.target.value;
      onChange(newColor);
    }
  };

  return (
    <div className={`flex flex-row w-full justify-between items-center py-2 ${isDisabled ? 'opacity-50' : ''}`}>
      <label className="text-gray-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={handleColorChange}
          disabled={isDisabled}
          className={`h-[25px] w-[25px] cursor-pointer appearance-none p-0 m-0 overflow-hidden rounded ${isDisabled ? 'cursor-not-allowed' : ''}`}
        />
        <input
          type="text"
          value={value}
          onChange={handleColorChange}
          disabled={isDisabled}
          className={`rounded-lg shadow border border-gray-900 bg-[#AE7AA9]/40 text-gray-300 px-3 py-1 w-[88px] outline-none focus:border-[#0065BB] ${isDisabled ? 'cursor-not-allowed bg-gray-700/30' : ''}`}
        />
      </div>
    </div>
  );
}
