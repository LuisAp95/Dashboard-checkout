import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "../../../../context/AppContext";
import { useDivisePreview } from "../../../../context/device-preview-context";
import { ChevronUp } from "lucide-react";
import { MobileDropdown } from "./MobileDropdown";

interface Option {
  label: string;
  value: string;
  active?: boolean;
}

interface SelecSinBordertProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  label?: string;
  openUpwards?: boolean;
  centerText?: boolean;
  isBank?: boolean;
  isDocumentType?: boolean;
}

export const SelectSinBorder: React.FC<SelecSinBordertProps> = ({
  options,
  value,
  onChange,
  error,
  label = "Banco",
  openUpwards = false,
  // centerText = false,
  isBank = false,
  isDocumentType = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { deviceType } = useDivisePreview();
  const { states } = useAppContext();

  const isMobile = deviceType === "mobile";

  const selectedOption = options.find((opt) => opt.value === value);

  // Filtrar opciones según el término de búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;

    const searchLower = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const labelMatch = opt.label?.toLowerCase().includes(searchLower);
      const valueMatch = opt.value?.toLowerCase().includes(searchLower);
      return labelMatch || valueMatch;
    });
  }, [options, searchTerm]);

  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleOptionSelect = useCallback(
    (optValue: string) => {
      onChange(optValue);
      setOpen(false);
      setSearchTerm("");
    },
    [onChange]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
  }, []);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
    if (
      !open &&
      isMobile &&
      (isBank || isDocumentType) &&
      searchInputRef.current
    ) {
      // Pequeño delay para asegurar que el drawer esté renderizado
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open, isMobile, isBank, isDocumentType]);

  const showFloatingLabel = open || !!value;

  return (
    <div className="relative" ref={ref} style={{ color: states.textColorform }}>
      {/* Floating Label */}
      <label
        className={`absolute left-2 px-1 transition-all bg-transparent ${
          showFloatingLabel ? "text-xs -top-2 " : "mt-6 "
        } pointer-events-none z-20`}
      >
        {label}
      </label>

      {/*Selector Visible */}
      <div
        className={`border-b p-3 h-12  rounded cursor-pointer bg-transparent relative  ${
          open
            ? "border-[var(--hover-color)]"
            : ` ${
                error
                  ? "border-b-red-500 hover:border-b-4 hover:border-red-500"
                  : "border-b-gray-300 hover:border-b-4 hover:border-b-[var(--hover-color)]"
              }  `
        }`}
        onClick={toggleOpen}
        style={
          {
            "--hover-color": states.inputHoverColor,
            "--focus-color": states.inputHoverColor,
          } as React.CSSProperties
        }
      >
        <div className="flex items-center justify-between">
          <span className={`flex items-center h-full justify-start mt-2`}>
            {selectedOption?.label || ""}
          </span>
          {!isBank && (
            <span className="">
              <ChevronUp color="gray" />
            </span>
          )}
        </div>
      </div>

      {/* Dropdown - Desktop o Mobile */}
      {isMobile && (isBank || isDocumentType) ? (
        <MobileDropdown
          open={open}
          isBank={isBank}
          isMobile={isMobile}
          isDocumentType={isDocumentType}
          searchTerm={searchTerm}
          value={value}
          filteredOptions={filteredOptions}
          searchInputRef={searchInputRef}
          dropdownStyles={{
            backgroundColor: states.isBgFormulariocolor,
            color: states.textColorform,
            borderColor: states.inputHoverColor,
            bottom: openUpwards ? "100%" : "auto",
            top: openUpwards ? "auto" : "100%",
            marginTop: openUpwards ? "0" : "0.5rem",
            marginBottom: openUpwards ? "0.5rem" : "0",
          }}
          dropdownClasses="absolute left-0 w-full border rounded shadow z-50 max-h-60 overflow-y-auto"
          inputHoverColor={states.inputHoverColor}
          isBgFormulariocolor={states.isBgFormulariocolor}
          textColorform={states.textColorform}
          selecteTemplate={states.selecteTemplate}
          onSearchChange={handleSearchChange}
          onOptionSelect={handleOptionSelect}
          onClose={handleClose}
        />
      ) : (
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: openUpwards ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: openUpwards ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: states.isBgFormulariocolor,
                color: states.textColorform,
                borderColor: states.inputHoverColor,
                bottom: openUpwards ? "100%" : "auto",
                top: openUpwards ? "auto" : "100%",
                marginTop: openUpwards ? "0" : "0.5rem",
                marginBottom: openUpwards ? "0.5rem" : "0",
              }}
              className="absolute left-0 w-full border rounded shadow z-50 max-h-60 overflow-y-auto"
            >
              {filteredOptions.map((opt, i) => (
                <li
                  key={i}
                  className="p-2 hover:bg-blue-100 cursor-pointer text-center"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {isBank ? `${opt.value} - ${opt.label}` : opt.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}

      {error && <p className="absolute text-red-500 text-sm ">{error}</p>}
    </div>
  );
};
