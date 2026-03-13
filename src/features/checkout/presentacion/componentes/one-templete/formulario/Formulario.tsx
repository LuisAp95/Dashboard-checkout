import React, { memo } from "react";
import type { Data } from "../../../../../dashboard/dominio/interfaces/types";
import { useDivisePreview } from "../../../../../../context/device-preview-context";
import InputSelecteTemplet from "../../options-Input/InputTemplate";
import { BotonForm } from "../../../../utils/buttom/Buttons";
import { useAppContext } from "../../../../../../context/AppContext";
import { SyPagoLogoRegular } from "../../../../../../assets/svg/Svg";
import image from "../../../../../../assets/svg/Sypago-blue.svg";

type Props = {
  data: Data;
  openUtp: React.Dispatch<React.SetStateAction<boolean>>;
  datos: React.Dispatch<
    React.SetStateAction<{
      banco: string;
      cuenta: string;
      telefono: string;
      documento: string;
      documentType: string;
    }>
  >;
};

// Memorizamos los componentes hijos
const MemoizedInputSelecteTemplet = memo(InputSelecteTemplet);
const MemoizedBotonForm = memo(BotonForm);
const MemoizedSyPagoLogoRegular = memo(SyPagoLogoRegular);

export const Formulario: React.FC<Props> = memo(({ data, openUtp, datos }) => {
  const { deviceType } = useDivisePreview();
  const { selecLogo } = useAppContext().states;

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full px-5 relative ${deviceType === "desktop" && "md:mt-0"
        }`}
    >
      <div
        className={`hidden ${deviceType === "desktop" &&
          "md:flex md:w-full md:items-center md:justify-center md:h-[125px]"
          }`}
      >
        <div className="relative h-[130px] w-[400px] mty -mt-20 flex items-center justify-center mb-6">
          {selecLogo ? (
            <img
              className="max-w-full max-h-full w-auto h-auto object-contain"
              src={selecLogo}
              alt="Sycom"
              style={{ aspectRatio: "auto" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MemoizedSyPagoLogoRegular />
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col -mt-8 gap-5 md:max-w-[440px] mt-5">
        <MemoizedInputSelecteTemplet
          banks={data.banks}
          infoF={data.documentTypes}
          openUtp={openUtp}
          datos={datos}
        />
        <MemoizedBotonForm />
      </div>

      {/*
        <div className="absolute bottom-0 h-[80px] w-[130px] mty  flex items-center justify-center ">
          <img
            className="max-w-full max-h-full w-auto h-auto object-contain"
            src={image}
            alt="Sycom"
            style={{ aspectRatio: "auto" }}
          />
        </div>
     */ }
    </div>
  );
});
