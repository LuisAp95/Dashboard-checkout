import React from "react";
import { useDivisePreview } from "../../../../../context/device-preview-context";
import { useAppContext } from "../../../../../context/AppContext";
import { useTypography } from "../../../context/useFontContext";
import type { Data } from "../../../dominio/interfaces/types";
import { ViewCheckout } from "../../../../checkout/presentacion/pages/ViewCheckout";
import useWindowSize from "../../hooks/useWindowSize";
import { Monitor, Smartphone } from "lucide-react";
import Header from "../header/Header";

type Props = {
  data: Data;
};

export const MonitorPreview: React.FC<Props> = ({ data }) => {
  const { deviceType, setDeviceType } = useDivisePreview();
  const { height } = useWindowSize();
  const { font } = useTypography();
  const { states } = useAppContext();

  const containerBaseStyle = "justify-center flex-1 flex relative z-10";

  return (
    <div className="flex flex-col  h-screen justify-center flex-1 relative">
      <Header />

      <div style={{ fontFamily: font }} className={containerBaseStyle}>
        {/* Vista de Desktop */}
        {deviceType === "desktop" ? (
          <div
            //  style={{ width: width }}
            className=" w-full md:w-screen  device-transition origin-top scale-[0.75] shadow-2xl shadow-gray-900 --md:shadow-gray-300 absolute md:border --md:border-gray-300 md:rounded-md bg-white overflow-auto"
          >
            <div className="h-6 bg-gray-100 md:flex items-center px-2 gap-1 hidden">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div style={{ height: height }} className="overflow-auto">
              <ViewCheckout {...data} />
            </div>
          </div>
        ) : (
          /* Vista de Mobile */
          <div className="flex" style={{ height: "calc(100vh - 200px)" }}>
            <div
              style={{
                transform: `scale(${height && height >= 773 ? 0.8 : 0.64})`,
                backgroundColor:
                  deviceType === "mobile"
                    ? states.isBgFormulariocolor
                    : "white",
                transition: "all 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className=" w-[375px] h-[730px] top-3  origin-top m-auto border-8 border-gray-800 rounded-[1.75rem] overflow-auto custon-scrollbar"
            >
              <div className="sticky top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-lg z-3"></div>
              <div className="mt-[-24px]">
                <ViewCheckout {...data} />
              </div>
            </div>
          </div>
        )}

        {/* Controles de cambio de dispositivo */}
        <div className="hidden md:flex absolute origin-bottom bottom-8 justify-center items-center gap-2">
          <button
            className={`w-10 h-10 p-1.5 rounded-full transition-colors cursor-pointer ${
              deviceType === "desktop" ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setDeviceType("desktop")}
            aria-label="Switch to desktop view"
          >
            <Monitor
              className={`h-full w-full ${
                deviceType === "desktop" ? "text-blue-600" : "text-gray-600"
              }`}
            />
          </button>
          <button
            className={`w-10 h-10 p-1.5 rounded-full transition-colors cursor-pointer ${
              deviceType === "mobile" ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setDeviceType("mobile")}
            aria-label="Switch to mobile view"
          >
            <Smartphone
              className={`h-full w-full ${
                deviceType === "mobile" ? "text-blue-600" : "text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
