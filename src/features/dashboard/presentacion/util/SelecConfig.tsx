import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

interface TempletProps {
  title: string;
  options: { id: string; label: string }[];
  templet: string;
  selectT: (newValue: string) => void;
}

export const SelecConfig: FC<TempletProps> = ({
  title,
  options,
  templet,
  selectT,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => opt.id === templet) || options[0];

  const tooltipMessage =
    title === "tema"
      ? "Selecciona el tema que vas a personalizar para tu checkout"
      : title === "input"
      ? "Selecciona el input de tu preferencia"
      : "";

  return (
    <div className="w-full flex flex-col gap-4" ref={selectRef}>
      <div className="relative">
        {/* Select Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full h-10 items-center justify-between px-4 rounded-lg bg-[#1A0F17] hover:bg-[#AE7AA9]/40 cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            {(title === "tema" || title === "input") && (
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="w-4 h-4 text-gray-400" />
                {showTooltip && (
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded md:min-w-[200px] z-50 max-w-[200px] break-words border border-gray-700">
                    {tooltipMessage}
                  </div>
                )}
              </div>
            )}
            <span className="flex-1 text-gray-300">{selectedOption.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            ▼
          </motion.div>
        </div>

        {/* Dropdown Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full mt-2 overflow-hidden bg-[#1A0F17] rounded-lg"
            >
              {options.map((option) => (
                <motion.div
                  key={option.id}
                  onClick={() => {
                    selectT(option.id);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer transition-colors duration-200 text-left
                    ${
                      option.id === templet
                        ? "text-[#AE7AA9] bg-[#1A0F17]"
                        : "text-gray-300 hover:bg-[#AE7AA9]/40"
                    }`}
                >
                  {option.label}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
