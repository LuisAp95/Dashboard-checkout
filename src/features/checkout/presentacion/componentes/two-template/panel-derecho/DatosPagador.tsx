import React, { memo } from "react";
import type { FormProps } from "../../../../dominio/interfaces/types";
import InputSelecteTemplet from "../../options-Input/InputTemplate";
import { BotonContinuarFomr } from "../../../../utils/buttom/Buttons";
import {  useDivisePreview  } from "../../../../../../context/device-preview-context";

interface FormData {
  banco: string;
  cuenta: string;
  telefono: string;
  documento: string;
  documentType: string;
}

export const DatosPagador: React.FC<FormProps> = memo((props) => {
  const { onNext, onBack, banks, cl } = props;
const {deviceType} = useDivisePreview()
  const handleFormData: React.Dispatch<React.SetStateAction<FormData>> = () => {
    // You can add validation here before calling onNext if needed
    onNext();
  };

  return (
    <div className={`flex flex-col w-full h-screen ${deviceType === 'desktop'&& 'md:w-full'}`}>
      <div className="flex w-full h-full flex-col justify-center gap-8">
        <h1 className="text-blue-600 text-2xl font-bold text-center">
          Ingrese sus datos para pagar
        </h1>
        <InputSelecteTemplet
          banks={banks}
          infoF={cl}
          onNext={onNext}
          openUtp={() => {}}
          datos={handleFormData}
        />
      </div>
      <BotonContinuarFomr onNext={onNext} onBack={onBack} name="Continuar" />
    </div>
  );
});

DatosPagador.displayName = "DatosPagador";
