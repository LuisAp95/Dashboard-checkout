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

  const containerBaseStyle = "flex min-h-0 flex-1 justify-center relative z-10";

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col">
      <Header />

      <div
        style={{ fontFamily: font }}
        className={`${containerBaseStyle} ${
          deviceType === "mobile"
            ? "flex-col items-center overflow-auto py-6"
            : "items-center"
        }`}
      >
        {/* Vista de Desktop */}
        {deviceType === "desktop" ? (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-full origin-center device-transition scale-[0.85] shadow-2xl shadow-gray-900 --md:shadow-gray-300 md:w-screen md:border --md:border-gray-300 md:rounded-md bg-white overflow-auto">
              <div className="h-6 bg-gray-100 md:flex items-center px-2 gap-1 hidden">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div style={{ height: height }} className="overflow-auto">
                <ViewCheckout {...data} />
              </div>
            </div>
          </div>
        ) : (
          /* Vista de Mobile */
          <div className="flex w-full min-w-[406px] flex-1 justify-center">
            <div
              style={{
                backgroundColor:
                  deviceType === "mobile"
                    ? states.isBgFormulariocolor
                    : "white",
              }}
              className="box-content h-[844px] w-[390px] shrink-0 self-start border-[8px] border-gray-800 rounded-[2.5rem] shadow-2xl overflow-auto custon-scrollbar"
            >
              <div className="sticky top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-lg z-30"></div>
              <div className="mt-[-24px]">
                <ViewCheckout {...data} />
              </div>
            </div>
          </div>
        )}

        {/* Controles de cambio de dispositivo */}
        <div className="absolute bottom-4 right-4 z-50 hidden items-center gap-2 rounded-full border border-gray-200 bg-white/95 p-1 shadow-lg backdrop-blur md:flex">
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
