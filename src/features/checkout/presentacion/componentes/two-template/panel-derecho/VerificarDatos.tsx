//import { ArrowLeft } from "lucide-react";
import { BotonContinuar } from "../../../../utils/buttom/Buttons";
import type  { PasosProps } from "../../../../dominio/interfaces/types";
import { useDivisePreview } from "../../../../../../context/device-preview-context";
import ConfirmarDatos from "../../confirmarDatos/ConfirmarDatos";

export default function VerificarDatos({ onNext, onBack }: PasosProps) {
  const { deviceType } = useDivisePreview();

  return (
    <div className="flex flex-col gap-y-9  h-screen justify-center items-center">
      <h1
        className={`text-blue-600 text-2xl font-bold ${deviceType === "desktop"
          && "md:hidden"
          }`}
      >
        Verificar Datos
      </h1>

      <ConfirmarDatos />
      <BotonContinuar onNext={onNext} onBack={onBack} name="Verificar Datos" />
      
    </div>
  );
}
