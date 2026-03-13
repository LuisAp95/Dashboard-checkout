import { memo } from "react";
import type { Data } from "../../../../../dashboard/dominio/interfaces/types";
import { useDivisePreview } from "../../../../../../context/device-preview-context";
import { useAppContext } from "../../../../../../context/AppContext";
import syPagoLogo from "../../../../../../assets/svg/Sypago.svg";
import conatelLogo from "../../../../../../assets/svg/0168_W.svg";

interface InfoCobroProps extends Data {
  onOpenTermsModal?: () => void;
}

export const InfoCobro: React.FC<InfoCobroProps> = memo((props) => {
  const { deviceType } = useDivisePreview();
  const { textColorInfo, bgColorPago, textColorPago, selectedTemplateName } =
    useAppContext().states;
  const { onOpenTermsModal } = props;

  return (
    <div
      style={{ color: textColorInfo }}
      className={` relative  h-full w-full flex flex-col justify-center items-center  
         p-4`}
    >
      {deviceType === "desktop" && (
        <>
          {selectedTemplateName !== "0168" &&
            selectedTemplateName !== "netuno" &&
            selectedTemplateName !== "Conatel" && (
              <div className="md:flex hidden relative md:h-[150px] md:w-[300px] logo items-center justify-center ">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={syPagoLogo}
                    alt="Sycom"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

          {selectedTemplateName == "Conatel" && (
            <div className="md:flex hidden relative md:h-[150px] md:w-[280px]  items-center justify-center ">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={conatelLogo}
                  alt="Sycom"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div
        className={`flex flex-col  items-center  
            p-2 [&>*]:my-[0.65rem] ${deviceType === "desktop" && "md:[&>*]:my-[1.2rem]"
          }`}
      >
        <div className={`flex flex-col items-center`}>
          <p
            className={`font-bold text-2xl ${deviceType === "desktop" && "md:text-3xl"
              }`}
          >

            {props.companyName}
          </p>
          <p
            className={`text-base mt-1  ${deviceType === "desktop" && "md:text-2xl md:mt-2"
              }`}
          >
            {props.companyRif}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h2
            className={`text-lg font-light ${deviceType === "desktop" && "md:text-xl"
              }`}
          >
            Cobro por concepto de:
          </h2>
          <h2
            className={` text-lg text-center ${deviceType === "desktop" &&
              "font-bold md:text-lg text-sm text-center mt-1 md:mt-2 max-w-[300px] md:max-w-none  line-clamp-2 md:line-clamp-none tracking-wider"
              } `}
          >

            {props.description}
          </h2>
        </div>
        <div
          style={{
            backgroundColor: bgColorPago,
            color: textColorPago,
          }}
          className={`flex flex-col items-center px-5 justify-center w-[265px] h-[85px] rounded-[30px] ${deviceType === "desktop" && "md:w-[330px] md:h-[100px]"
            }`}
        >
          <h2 className={`text-xl ${deviceType === "desktop" && "md:text-xl"}`}>
            Total a Pagar
          </h2>
          <p
            className={`font-bold text-xl ${deviceType === "desktop" && "md:text-2xl "
              }`}
          >
            Bs. {props.totalAmount}
          </p>
        </div>
        <div
          className={`hidden font-light absolute w-full max-w-[700px] bottom-0 justify-center px-24 text-lg ${deviceType === "desktop" && "md:flex"
            }`}
        ></div>
      </div>

      {deviceType === "desktop" && (
        <div
          className={`hidden font-light absolute w-full max-w-[800px] bottom-0 mb justify-center  text-lg md:flex`}
        >
          <div className="w-full flex flex-row justify-between">
            <p
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onOpenTermsModal}
            >
              Términos y Condiciones
            </p>
            <p className="cursor-pointer">Ayuda</p>
          </div>
        </div>
      )}
    </div>
  );
});
