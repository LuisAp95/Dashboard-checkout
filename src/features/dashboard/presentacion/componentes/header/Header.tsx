import { Save, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDivisePreview } from "../../../../../context/device-preview-context";
// import { SyPagoLogoRegular } from "../../../../../assets/svg/Svg";
import { useAppContext } from "../../../../../context/AppContext";
import { useTypography } from "../../../context/useFontContext";
import { useTemplates } from "../../../context/useTemplates";
import type { ConfigurationData } from "../../types/ConfigTypes";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CurrentTemplate from "./CurrentTemplate";

export default function Header() {
  const navigate = useNavigate();
  const { states, actions } = useAppContext();
  const { font } = useTypography();
  const { saveTemplate, updateTemplate } = useTemplates();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { deviceType } = useDivisePreview();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setShowInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;

    setIsSaving(true);

    try {
      // Desestructuramos isOpenModal para excluirlo y el resto va a configData
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isOpenModal, selectedTemplateName, ...configStates } = states;

      const templateData = {
        templateName: templateName.trim(),
        ...configStates,
        font,
        hasActiveTemplate: true,
      };

      // Guardar el template
      await saveTemplate(templateData);
      
      // Aplicar el template inmediatamente después de guardarlo
      actions.setSelectedTemplateName(templateData.templateName);
      actions.setHasActiveTemplate(true);

      // Limpiar y cerrar
      setTemplateName("");
      setShowInput(false);
      setIsDropdownOpen(false);
      
      alert("Template guardado exitosamente.");
    } catch (error) {
      console.error("Error al guardar template:", error);
      alert("Error al guardar el template. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewTemplateClick = () => {
    setShowInput(true);
  };

  const handleUpdateTemplate = async () => {
    if (!states.selectedTemplateName) {
      alert("No hay un template seleccionado para actualizar.");
      return;
    }

    setIsSaving(true);

    try {
      // Desestructuramos isOpenModal para excluirlo y el resto va a configData
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isOpenModal, selectedTemplateName, ...configStates } = states;

      const configData: ConfigurationData = {
        ...configStates,
        font,
      };

      // Actualizar el template
      await updateTemplate(states.selectedTemplateName, configData as unknown as Partial<{ templateName: string; selecteTemplate?: string; [key: string]: string | boolean | null | undefined }>);

      setIsDropdownOpen(false);
      
      alert("Template actualizado exitosamente.");
    } catch (error) {
      console.error("Error al actualizar template:", error);
      alert("Error al actualizar el template. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveButtonClick = () => {
    // Si es template nuevo, mostrar directamente el input
    if (!states.hasActiveTemplate) {
      setShowInput(true);
      setIsDropdownOpen(true);
    } else {
      // Si es template existente, mostrar el dropdown con opciones
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // Determinar si mostrar la opción de guardar template
  const showSaveTemplateOption = !states.hasActiveTemplate;

  return (
    <header className="w-full lg:z-[21] items-center flex h-[8vh] relative justify-end pr-4 lg:pr-11">
      <div className="flex items-center gap-4">
        <CurrentTemplate />
        {deviceType === "desktop" && (
          <button
            onClick={() => navigate("/template-view")}
            className="p-2 cursor-pointer text-gray-600 hover:text-[#AE7AA9] hover:bg-gray-100 rounded-full transition-colors"
            title="Vista Completa"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleSaveButtonClick}
            className="p-2 cursor-pointer text-[#AE7AA9] hover:text-[#AE7AA9] hover:bg-[#AE7AA9]/20 rounded-full transition-colors flex items-center gap-1 "
            title={
              showSaveTemplateOption ? "Guardar Template" : "Guardar Cambios"
            }
          >
            <Save className="w-6 h-6" />
            {/* <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />*/}
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 min-w-[200px] bg-[#1A0F17] rounded-lg shadow-lg border border-gray-900 overflow-hidden z-50"
              >
                {showSaveTemplateOption ? (
                  // Template nuevo: mostrar directamente el input
                  <div className="p-3 space-y-2">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Nombre del template"
                      className="w-full px-3 py-2 bg-[#AE7AA9]/30 border border-gray-900 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE7AA9] focus:border-transparent"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && templateName.trim()) {
                          handleSaveTemplate();
                        }
                        if (e.key === "Escape") {
                          setShowInput(false);
                          setTemplateName("");
                          setIsDropdownOpen(false);
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveTemplate}
                        disabled={!templateName.trim() || isSaving}
                        className="flex-1 px-3 py-2 bg-[#AE7AA9]/80 text-white rounded-md hover:bg-[#AE7AA9]/50 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 text-sm"
                      >
                        {isSaving ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={() => {
                          setShowInput(false);
                          setTemplateName("");
                          setIsDropdownOpen(false);
                        }}
                        disabled={isSaving}
                        className="px-3 py-2 bg-[#AE7AA9]/20 text-gray-300 rounded-md hover:bg-[#AE7AA9]/40 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Template existente: mostrar dos opciones
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleNewTemplateClick();
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700/50 transition-colors text-sm cursor-pointer"
                    >
                      Guardar como nuevo template
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateTemplate();
                      }}
                      disabled={isSaving}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700/50 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Actualizando..." : "Actualizar template"}
                    </button>
                  </div>
                )}
                {/* Mostrar input cuando se selecciona "Guardar como nuevo template" en template existente */}
                {!showSaveTemplateOption && showInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 space-y-2 border-t border-gray-700"
                  >
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Nombre del template"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0065BB] focus:border-transparent"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && templateName.trim()) {
                          handleSaveTemplate();
                        }
                        if (e.key === "Escape") {
                          setShowInput(false);
                          setTemplateName("");
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveTemplate}
                        disabled={!templateName.trim() || isSaving}
                        className="flex-1 px-3 py-2 bg-[#AE7AA9]/30 text-white rounded-md hover:bg-[#AE7AA9]/50 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 text-sm"
                      >
                        {isSaving ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={() => {
                          setShowInput(false);
                          setTemplateName("");
                        }}
                        disabled={isSaving}
                        className="px-3 py-2 bg-[#AE7AA9]/20 text-gray-300 rounded-md hover:bg-[#AE7AA9]/40 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

/*

    <header className="px-4 lg:px-11 w-full bg-white md:bg-transparent lg:z-[21] items-center flex h-[12vh]  relative">
      <div className="flex w-full items-center justify-between md:backdrop-blur-md bg-white/20 md:rounded-full  px-3 py-4 border-b border-b-gray-300 shadow ">
        <div className="flex items-center gap-2 ml-10">
          <div className="w-[150px] ">
            <SyPagoLogoRegular />
          </div>
          {states.hasActiveTemplate && states.selectedTemplateName && (
            <div className="text-[#0065BB] font-medium">
              Template: {states.selectedTemplateName}
            </div>
          )}
        </div>
        <div className="flex items-center gap-5 mr-10">
          {deviceType === "desktop" && (
            <button
              onClick={() => navigate("/template-view")}
              className="flex border items-center gap-1 p-1 px-2 rounded-sm cursor-pointer text-[#00bcf4] hover:bg-purple-50 hover:text-purple-700"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Vista Completa</span>
            </button>
          )}
          {showSaveTemplateOption &&
            (showInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Nombre del template"
                  className="px-3 py-2 border rounded-md"
                  autoFocus
                />
                <button
                  onClick={handleSaveTemplate}
                  disabled={!templateName.trim()}
                  className="text-green-700  cursor-pointer  transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  <Save className="w-8 h-8 disabled:bg-gray-300" />
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setTemplateName("");
                  }}
                  className="  text-white rounded-md hover:bg-red-200 cursor-pointer transition-colors"
                >
                  <X className="text-red-600 w-8 h-8" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowInput(true)}
                className="border-[#0065BB] border p-1 px-2 rounded-sm cursor-pointer text-[#0065BB] bg-white hover:text-white hover:bg-[#0065BB] transitions-colors"
              >
                Guardar Template
              </button>
            ))}
          {!showSaveTemplateOption && (
            <button
              onClick={handleSaveConfiguration}
              className="border-[#0065BB] border p-1 px-2 rounded-sm cursor-pointer text-[#0065BB] bg-white hover:text-white hover:bg-[#0065BB] transitions-colors"
            >
              Guardar Cambios
            </button>
          )}
        </div>
      </div>
    </header> */
