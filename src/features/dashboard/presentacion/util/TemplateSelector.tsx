import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useTemplates } from "../../context/useTemplates";

export const TemplateSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { templates, isLoading, applyTemplate } = useTemplates();

  if (isLoading) {
    return <div className="w-full text-center py-2">Cargando templates...</div>;
  }

  // Agregar la opción de crear nuevo template al inicio del array
  const allTemplates = [
    {
      templateName: "Crear Nuevo Template",
      selecteTemplate: "new",
    },
    ...templates,
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Select Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full h-10 items-center justify-between px-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-all duration-200"
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
                  Seleccione un template predefinido para aplicar estilos o cree
                  uno nuevo
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="text-gray-300">Mis templates: </span>
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
            className="relative w-full mt-2 overflow-hidden bg-gray-700/30 rounded-lg"
          >
            {allTemplates.map((template) => (
              <motion.div
                key={template.templateName}
                onClick={() => {
                  applyTemplate(template);
                  setIsOpen(false);
                }}
                className="px-4 py-2 cursor-pointer transition-colors duration-200 text-left text-gray-300 hover:bg-gray-700/50"
              >
                {template.templateName}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
