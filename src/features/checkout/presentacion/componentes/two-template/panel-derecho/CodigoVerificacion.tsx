import { ArrowLeft } from "lucide-react";
import { useDivisePreview } from "../../../../../../context/device-preview-context";
import VerificationModal from "../../utp/VerificacionModal";
import { useAppContext } from "../../../../../../context/AppContext";

interface CodigoVerificacionProps {
  onBack: () => void;
  onSuccess: () => void

}
export default function CodigoVerificacion({
  onBack, onSuccess,
}: CodigoVerificacionProps) {
  const { deviceType } = useDivisePreview();
  const {states} = useAppContext()
    //<div className="flex flex-col items-center justify-center mt-20"></div>

  return (
    <div style={{color: states.textColorPaneIqz}}
    className={`space-y-6 justify-center flex flex-col  items-center h-screen ${ deviceType === 'desktop' && 'md:h-auto'} `}>
        
      <VerificationModal onSuccess={onSuccess} />
      <div
        className={`flex justify-between left-4 origin-bottom bottom-6 absolute ${deviceType === "desktop" && "md:absolute md:w-[85%]"} `}>
        <button
          onClick={onBack}
          className="border border-gray-300   w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
