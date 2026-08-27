import { useState } from "react";
import { useAppContext } from "../../../../../context/AppContext";
import { SelecConfig } from "../../util/SelecConfig";
import ColorInput from "../../util/InputColor";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { TemplateSelector } from "../../util/TemplateSelector";

export default function Styles() {
  const { actions, states } = useAppContext();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [tooltips, setTooltips] = useState<{ [key: string]: boolean }>({});

  // Opciones para los selects
  const options = [
    { id: "1", label: "Tema 1", img: "" },
    { id: "2", label: "Tema 2", img: "" },
  ];
  const options2 = [
    { id: "1", label: "Input 1" },
    { id: "2", label: "Input 2" },
    { id: "3", label: "Input 3" },
  ];

  // Configuración de secciones
  const sectionConfig = [
    {
      id: "detalle",
      title: states.selecteTemplate === "1" ? "Detalles del Cobrador" : "Panel Izquierdo",
      description: "Personaliza la apariencia del panel de los detalles del cobrador",
      inputs: [
        { id: "bgColor", label: "Fondo", value: states.isBgcolor, action: actions.setIsBgcolor },
        { id: "textColor", label: "Color de Texto", value: states.textColorInfo, action: actions.setTextColorInfo },
        { id: "paymentTextColor", label: "Color Texto de Pago", value: states.textColorPago, action: actions.setTextColorPago },
        { id: "paymentBgColor", label: "Fondo de pago", value: states.bgColorPago, action: actions.setBgColorPago }
      ]
    },
    {
      id: "formulario",
      title: states.selecteTemplate === "1" ? "Formulario" : "Panel Derecho",
      description: "Personaliza la apariencia del panel de la información del pagador",
      inputs: [
        { id: "formBgColor", label: "Fondo", value: states.isBgFormulariocolor, action: actions.setIsBgFormulariocolor },
        { id: "formLabelColor", label: "Color Texto Label", value: states.textColorform, action: actions.setTextColorform },
        { id: "formButtonBgColor", label: "Color Botones", value: states.bgButtonColorForm, action: actions.setbgButtonColorForm },
        { id: "formButtonTextColor", label: "Color Texto Botones", value: states.textColorBotonForm, action: actions.setTextColorBotonForm },
        { id: "inputHoverColor", label: "Color Hover Inputs", value: states.inputHoverColor, action: actions.setInputHoverColor },
        { id: "textColorPaneIqz", label: "Text Color", value: states.textColorPaneIqz, action: actions.setTextColorPaneIqz },
        { id: "textColorConInfo", label: "Color Texto Info", value: states.textColorConInfo, action: actions.setTextColorConInfo }
      ]
    },
    {
      id: "modal",
      title: "Configuración Modal",
      description: "Personaliza la apariencia de los modal de proceso de pago",
      inputs: [
        { id: "modalBgColor", label: "Fondo Modal", value: states.bgModalColor, action: actions.setBgModalColor },
        { id: "modalTextColor", label: "Texto Color Modal", value: states.textColorModal, action: actions.setTextColorModal },
        { id: "textModalColorInfo", label: "Text Color Info", value: states.textModalColorInfo, action: actions.setTextModalColorInfo }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleTooltip = (sectionId: string, show: boolean) => {
    setTooltips(prev => ({
      ...prev,
      [sectionId]: show
    }));
  };

  return (
    <div className="flex flex-col gap-3 w-full text-gray-300 text-sm">
      {/* Selector de Templates */}
      <TemplateSelector />

      {/* Selects de configuración */}
      <SelecConfig
        title="tema"
        options={options}
        selectT={actions.setSelecteTemplate}
        templet={states.selecteTemplate}
      />

      <div className={`flex h-10 font-medium text-gray-300 flex-row items-center justify-between px-4 py-2 rounded-lg bg-[#1A0F17] ${states.selecteTemplate !== '1' && ' opacity-50 '}`}>
        <h1>Invertir Tema</h1>
        <div className={`flex w-[35px] h-[15px] relative p-1 shadow-gray-900 shadow bg-gray-600 rounded-full ${states.selecteTemplate !== '1' ? 'pointer-events-none opacity-50 cursor-not-allowed': 'cursor-pointer' }`} onClick={() => states.selecteTemplate 
          === '1' && actions.setIsPosition(!states.isPosition) }>
          <div className={`absolute  h-[15px] w-[15px] transition-all duration-300 rounded-full  ${states.isPosition ? 'bg-[#AE7AA9] top-0 left-0 translate-x-0 ' : 'bg-gray-400 top-0 translate-x-full'}`}></div>
        </div>
      </div>

      <SelecConfig
        title="input"
        options={options2}
        selectT={actions.setSelecteImputT}
        templet={states.selectImputT}
      />

      {/* Secciones de configuración de colores */}
      {sectionConfig.map((section) => (
        <div key={section.id} className="w-full">
          <div
            onClick={() => toggleSection(section.id)}
            className="flex w-full h-10 items-center justify-between px-4 rounded-lg bg-[#1A0F17] hover:bg-[#AE7AA9]/40 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <div
                className="relative flex items-center"
                onMouseEnter={() => handleTooltip(section.id, true)}
                onMouseLeave={() => handleTooltip(section.id, false)}
              >
                <Info className="h-4 w-4 text-gray-400" />
                <AnimatePresence>
                  {tooltips[section.id] && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50 border border-gray-700"
                    >
                      {section.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-gray-300 font-medium">{section.title}</span>
            </div>
            <motion.div
              animate={{ rotate: openSections[section.id] ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              ▼
            </motion.div>
          </div>

          <AnimatePresence>
            {openSections[section.id] && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full mt-2 overflow-hidden p-4 bg-[#1A0F17] rounded-lg"
              >
                {section.id === "modal" && (
                  <div className="flex gap-2 items-center justify-between mb-3 text-gray-300">
                    <h1>Mostrar Modal</h1>
                    <div 
                      className="flex w-[35px] h-[15px] relative p-1 cursor-pointer shadow-gray-900 shadow bg-gray-600 rounded-full" 
                      onClick={() => actions.setIsOpenModal(!states.isOpenModal)}
                    >
                      <div className={`absolute h-[15px] w-[15px] transition-all duration-300 rounded-full ${states.isOpenModal ? 'bg-[#AE7AA9] top-0 left-0 translate-x-0' : 'bg-gray-400 top-0 translate-x-full'}`}></div>
                    </div>
                  </div>
                )}
                {section.inputs.map((input, index) => (
                  <ColorInput
                    key={index}
                    id={input.id}
                    label={input.label}
                    value={input.value}
                    onChange={input.action}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}