// components/FontSelector/FontSelector.tsx
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTypography } from "../../context/useFontContext";
import { Info } from "lucide-react";

type FontType = "ibmPlex" | "inter" | "arial" | "sans";

const fonts: Array<{ id: FontType; label: string }> = [
  { id: "inter", label: "Inter" },
  { id: "arial", label: "Arial" },
  { id: "sans", label: "Sans Serif" },
];

const getFontFamily = (fontId: FontType): string => {
  switch (fontId) {
    case "inter":
      return "Inter, system-ui, sans-serif";
    case "arial":
      return "Arial, system-ui, sans-serif";
    default:
      return "system-ui, sans-serif";
  }
};

export const TypographySelector = () => {
  const { font, setFont } = useTypography();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = fonts.find((opt) => opt.id === font) || fonts[0];

  return (
    <div className="w-full flex flex-col gap-4" ref={selectRef}>
      {/* Select Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full h-10 items-center justify-between px-4 rounded-lg bg-[#1A0F17] hover:bg-[#AE7AA9]/40 cursor-pointer transition-all duration-200"
      >
        <span className="flex-1 gap-2 flex items-center">
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4 text-gray-400" />
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50 border border-gray-700"
                >
                  Seleccione la fuente de su preferencia
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="text-gray-300">Fuente: </span>
          <span
            style={{ fontFamily: getFontFamily(selectedOption.id) }}
            className="text-gray-300"
          >
            {selectedOption.label}
          </span>
        </span>
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
            {fonts.map((option) => (
              <motion.div
                key={option.id}
                onClick={() => {
                  setFont(option.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer transition-colors duration-200 text-left
                  ${
                    option.id === font
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
  );
};
