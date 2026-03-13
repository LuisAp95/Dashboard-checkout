import React from "react";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../../../../context/AppContext";
import { useDivisePreview } from "../../../../context/device-preview-context";

interface ButonCuentaPhoneProps {
  setCuenta: React.Dispatch<React.SetStateAction<string>>;
  cuenta: string;
}

export const ButonCuentaPhone: React.FC<ButonCuentaPhoneProps> = ({
  setCuenta,
  cuenta,
}) => {
  const { states } = useAppContext();

  return (
    <div className="flex flex-row gap-2 text-sm ">
      <div
        style={{
          backgroundColor:
            cuenta == "Telefono" ? states.bgButtonColorForm : "#d1d5dc",
          cursor: cuenta !== "Telefono" ? "pointer" : "default",
          color: cuenta == "Telefono" ? states.textColorBotonForm : "#5d6d7e",
        }}
        onClick={() => setCuenta("Telefono")}
        className="rounded-full whitespace-nowrap  
                    px-[9px]  flex items-center justify-center text-sm  mr-3 
                    transition-colors duration-300 drop-shadow-xl 
                    shadow-slate-300 w-[100px] h-[30px]"
      >
        Teléfono
      </div>
      <div
        onClick={() => setCuenta("Cuenta")}
        style={{
          backgroundColor:
            cuenta == "Cuenta" ? states.bgButtonColorForm : "#d1d5dc",
          cursor: cuenta == "Telefono" ? "pointer" : "default",
          color: cuenta == "Cuenta" ? states.textColorBotonForm : "#5d6d7e",
        }}
        className="rounded-full whitespace-nowrap  
                   px-[9px]  flex items-center justify-center text-sm  mr-3 
                    transition-colors duration-300 drop-shadow-xl 
                    shadow-slate-300 w-[100px] h-[30px]"
      >
        Cuenta
      </div>
    </div>
  );
};

interface BotonConProps {
  onNext?: () => void;
  onBack: () => void;
  name: string;
}

export const BotonContinuar: React.FC<BotonConProps> = ({
  onNext,
  onBack,
  name,
}) => {
  const { deviceType } = useDivisePreview();
  const { states } = useAppContext();

  return (
    <div
      className={`flex justify-between pt-8 origin-bottom bottom-6 relativo w-full ${
        deviceType === "desktop" && "md:absolute md:w-[85%]"
      } `}
    >
      <button
        onClick={onBack}
        className="border border-gray-300 text-gray-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        style={{
          backgroundColor: states.bgButtonColorForm,
          color: states.textColorBotonForm,
        }}
        onClick={onNext}
        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
      >
        {name}
      </button>
    </div>
  );
};

export const BotonContinuarFomr: React.FC<BotonConProps> = ({
  onBack,
  name,
}) => {
  const { deviceType } = useDivisePreview();
  const { states } = useAppContext();

  return (
    <div
      className={`flex justify-between pt-8 origin-bottom bottom-6 relativo w-full ${
        deviceType === "desktop" && "md:absolute md:w-[85%]"
      } `}
    >
      <button
        onClick={onBack}
        className="border border-gray-300 text-gray-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="submit"
        form="formTemplate"
        style={{
          backgroundColor: states.bgButtonColorForm,
          color: states.textColorBotonForm,
        }}
        className=" px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
      >
        {name}
      </button>
    </div>
  );
};

export const BotonForm = () => {
  const { states } = useAppContext();
  const { deviceType } = useDivisePreview();

  return (
    <div className="flex flex-col gap-4 md:px-8 w-full">
      <button
        type="submit"
        form="formTemplate"
        style={{
          backgroundColor: states.bgButtonColorForm,
          color: states.textColorBotonForm,
        }}
        className={`p-2 bg-blue-800 text-white text-2xl rounded-xl cursor-pointer ${
          deviceType === "desktop" &&
          "md:p3 md:h-[75px] md:hover:scale-105 md:p-5 md:transition-all md:ease-in-out"
        }`}
      >
        Pagar
      </button>
    </div>
  );
};
