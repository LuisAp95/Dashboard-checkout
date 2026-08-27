import { useState } from "react";
import Styles from "./Styles";
import Features from "./Features";
import ConfigData from "./ConfigData";
import type { Data } from "../../../dominio/interfaces/types";
import sypagoLogo from "../../../../../assets/svg/Sypago.svg";
import { Palette, Settings, Menu, X, SquarePen } from "lucide-react";

interface ConfigProps {
  data: Data;
  onDataChange: (field: keyof Pick<Data, "companyName" | "companyRif" | "description" | "totalAmount">, value: string) => void;
  onLogoUpload: (imageUrl: string) => void;
  onBackgroundUpload: (imageUrl: string) => void;
  onTemplate1BackgroundUpload: (imageUrl: string) => void;
  onSave: () => void;
}

export default function ConfigPanel({
  onLogoUpload,
  onBackgroundUpload,
  onTemplate1BackgroundUpload,
  onSave,
  data,
  onDataChange,
}: ConfigProps) {
  const [activeSection, setActiveSection] = useState<"styles" | "features" | "data">("styles");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Botón Hamburger - Solo visible en pantallas < 1300px */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="hidden config-menu-button fixed top-4 left-4 z-50 p-3 bg-[#1A0F17] text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200"
        aria-label="Abrir menú de configuración"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay - Solo visible cuando el menú está abierto en pantallas pequeñas */}
      {isMenuOpen && (
        <div
          className="hidden config-overlay fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Panel de Configuración */}
      <div
        className={`
          w-full md:flex md:w-[360px] bg-[#070208] h-full flex flex-col shadow-lg shadow-gray-900 rounded-2xl
          config-panel-mobile
          ${isMenuOpen ? "config-panel-visible" : "config-panel-hidden"}
        `}
      >
        {/* Logo Section */}
        <div className="px-4 py-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-center">
            <div className="w-55">
                <img src={sypagoLogo} alt="SyPago" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-2 py-4 space-y-2 flex-shrink-0 border-b border-gray-700">
          
          {/* Botón Estilos */}
          <div
            onClick={() => setActiveSection("styles")}
            className={`relative flex items-center w-full px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
              activeSection === "styles"
                ? "text-white bg-gradient-to-r from-[#AE7AA9]/30 to-transparent"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            {activeSection === "styles" && (
              <>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-full bg-[#AE7AA9] opacity-60 blur-md pointer-events-none"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-[#AE7AA9] rounded-r-full z-10 pointer-events-none"></div>
              </>
            )}
            
            <div className={`relative z-20 flex items-center gap-3 w-full ${activeSection === "styles" ? "text-[#AE7AA9]" : "text-gray-400 group-hover:text-gray-300"} transition-colors duration-300`}>
              <Palette className="w-5 h-5" />
              <span className="text-sm font-medium">Estilos</span>
            </div>
          </div>

          {/* Botón Características */}
          <div
            onClick={() => setActiveSection("features")}
            className={`relative flex items-center w-full px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
              activeSection === "features"
                ? "text-white bg-gradient-to-r from-[#AE7AA9]/30 to-transparent"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            {activeSection === "features" && (
              <>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-full bg-[#AE7AA9] opacity-60 blur-md pointer-events-none"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-[#AE7AA9] rounded-r-full z-10 pointer-events-none"></div>
              </>
            )}
            
            <div className={`relative z-20 flex items-center gap-3 w-full ${activeSection === "features" ? "text-[#AE7AA9]" : "text-gray-400 group-hover:text-gray-300"} transition-colors duration-300`}>
              <SquarePen className="w-5 h-5" />
              <span className="text-sm font-medium">Características</span>
            </div>
          </div>

          {/* Botón de Config Data */}
          <div
            onClick={() => setActiveSection("data")}
            className={`relative flex items-center w-full px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
              activeSection === "data"
                ? "text-white bg-gradient-to-r from-[#AE7AA9]/30 to-transparent"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            {activeSection === "data" && (
              <>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-full bg-[#AE7AA9] opacity-60 blur-md pointer-events-none"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-[#AE7AA9] rounded-r-full z-10 pointer-events-none"></div>
              </>
            )}
            
            <div className={`relative z-20 flex items-center gap-3 w-full ${activeSection === "data" ? "text-[#AE7AA9]" : "text-gray-400 group-hover:text-gray-300"} transition-colors duration-300`}>
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Configuración</span>
            </div>
          </div>
        </div>



        {/* Content Section */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4
        [&::-webkit-scrollbar]:w-[6px] 
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-600/60
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-gray-500/70"
        >
          {activeSection === "features" ? (
            <Features
              onLogoUpload={onLogoUpload}
              onBackgroundUpload={onBackgroundUpload}
              onTemplate1BackgroundUpload={onTemplate1BackgroundUpload}
              onSave={onSave}
            />
          ) : activeSection === "data" ? (
            <ConfigData data={data} onChange={onDataChange} />
          ) : (
            <Styles />
          )}
        </div>

        {/* Logout Section */}
        {/*<div className="px-2 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-700/50 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </div>
      </div>*/}
      </div>
    </>
  );
}
