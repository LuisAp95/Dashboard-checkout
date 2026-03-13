import React from "react";
import { useDivisePreview } from "../../../../../../context/device-preview-context";
import { useAppContext } from "../../../../../../context/AppContext";
import type { OnePasosProps } from "../../../../dominio/interfaces/types";
import { SyPagoLogoRegular } from "../../../../../../assets/svg/Svg";

export const DatosCobrador: React.FC<OnePasosProps> = (props) => {
  const { name, rif, concept, total, onNext } = props;
  const { deviceType } = useDivisePreview();
  const { states } = useAppContext()

  return (
    <div className={`flex flex-col w-full gap-4 rounded-2xl text-center justify-center h-screen bg-transparent ${deviceType === 'desktop' && ' md:h-auto'}`}>
      <h1
        className={`hidden justify-center text-blue-600 text-2xl font-bold ${deviceType === "desktop"
          && "md:hidden"}`}>
        Datos del Cobrador
      </h1>
      <div className="relative w-full flex justify-center items-center h-[100px] -mt-8">
        {states.selecLogo ? (
          <div className="relative h-[100px] w-[350px] flex items-center justify-center">
            <img
              className="max-w-full max-h-full w-auto h-auto object-contain"
              src={states.selecLogo}
              alt="Sycom"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        ) : (
          <div className="w-[250px] h-[100px] flex items-center justify-center">
            <SyPagoLogoRegular />
          </div>
        )}
      </div>    
      <div className="felx flex-col text-center">
        <h1 className="text-xl font-semibold">{name}</h1>
        <p className="text-sm">{rif}</p>
        <p className="mt-4 ">
          Cobro por concepto de: <br />
          <span className="font-medium">{concept}</span>
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm ">Total a Pagar</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className={`flex justify-end pt-8 origin-bottom bottom-6 absolute ${deviceType === "desktop" && "md:absolute md:w-[85%]"}`}>
        <button
          onClick={onNext}
          className="px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
          style={{
            backgroundColor: states.bgButtonColorForm,
            color: states.textColorBotonForm
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
