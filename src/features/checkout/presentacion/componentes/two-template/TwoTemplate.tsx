import  React , { useState } from "react";
import { useDivisePreview } from "../../../../../context/device-preview-context";
import { useAppContext } from "../../../../../context/AppContext";
import image from "../../assets/img2.jpg";
import type { Data } from "../../../../dashboard/dominio/interfaces/types";
import PasosSeguir from "./panel-izquierdo/PasosSeguir";
import { DatosPagador } from "./panel-derecho/DatosPagador";
import ProgressCircle from "./panel-derecho/PogressCircle";
import VerificarDatos from "./panel-derecho/VerificarDatos";
import CodigoVerificacion from "./panel-derecho/CodigoVerificacion";
import { DatosCobrador } from "./panel-derecho/DatosCobrador";
import SuccessModal from "../utp/SuccesModal";
import Modal from "../../../utils/modal/Modal";

export type Step = {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
  current: boolean;
};

export const TwoTemplate: React.FC<Data> = (props) => {
  const {
    companyName,
    companyRif,
    description,
    totalAmount,
    banks,
    documentTypes,
  } = props;
  const { deviceType } = useDivisePreview();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { states } = useAppContext();
  const totalSteps = 4;

  const steps: Step[] = [
    {
      id: 1,
      title: "Datos del Cobrador",
      icon: "check",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: "Datos del Pagador",
      icon: "check",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Confirmar Datos",
      icon: "credit-card",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "Codigo de Verificación",
      icon: "rotate-ccw-key",
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOpen = () => {
    setShowSuccessModal(true);
  };
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DatosCobrador
            name={companyName}
            rif={companyRif}
            total={totalAmount}
            concept={description}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <DatosPagador
            banks={banks}
            cl={documentTypes}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <VerificarDatos
            name={companyName}
            rif={companyRif}
            total={totalAmount}
            concept={description}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <CodigoVerificacion onBack={handleBack} onSuccess={handleOpen} />
        );
      default:
        return (
          <DatosCobrador
            name={companyName}
            rif={companyRif}
            total={totalAmount}
            concept={description}
            onNext={handleNext}
          />
        );
    }
  };
  return (
    <div
      className={`relative w-full h-full text-black flex flex-col items-center justify-center ${
        deviceType === "desktop" && "md:bg-transparent"
      }`}
      style={{
        backgroundImage: deviceType === "desktop" ? `url(${states.selecBgImage ? states.selecBgImage : image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay para el sombreado tenue */}
      {deviceType === "desktop" && (
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-0"
          //style={{ zIndex: 0 }}
        />
      )}
      
      {!showSuccessModal ? (
        <div
          style={{
            backgroundColor:
              deviceType === "desktop"
                ? states.isBgcolor
                : states.isBgFormulariocolor,
            position: 'relative',
            zIndex: 1
          }}
          className={`flex flex-col w-full h-[600px]  items-center bg-transparent ${
            deviceType === "desktop" &&
            "bg-white/70 md:rounded-2xl md:backdrop-blur-2xl md:max-w-[750px] md:shadow md:p-0 md:flex-row md:gap-5 md:max-h-[500px]"
          }`}
        >
          <div
            style={{
              backgroundColor:
                deviceType === "desktop"
                  ? states.isBgcolor
                  : states.isBgFormulariocolor,
            }}
            className={`flex flex-row mt-4 w-full relative justify-center ${
              deviceType === "desktop" &&
              "md:flex md:flex-col md:max-w-[300px] md:min-w-[300px] h-full md:gap-5 md:justify-center md:pl-10 md:rounded-l-2xl md:mt-0"
            }`}
          >
            <PasosSeguir steps={steps} />
          </div>
          <div
            style={{ backgroundColor: states.isBgFormulariocolor ,
              color: states.textColorPaneIqz
            }}
            className={`flex flex-col w-full gap-5 px-10 py-8 justify-center bg-transparent h-full relative ${
              deviceType === "desktop" && "md:w-[60%] md:rounded-r-2xl"
            }`}
          >
            <div
              className={`hidden ${
                deviceType === "desktop" &&
                "md:flex md:items-center md:absolute md:top-4 md:right-4"
              }`}
            >
              <ProgressCircle
                progress={(currentStep / totalSteps) * 100}
                text={`${currentStep}/${totalSteps}`}
              />
            </div>
            {renderStep()}
          </div>
        </div>
      ) : (
        <Modal 
          onClose={handleSuccessClose}
          maxWidth="md:max-w-[450px]"
          showCloseButton={false}
        >
          <SuccessModal onClose={handleSuccessClose} />
        </Modal>
      )}
    </div>
  );
};
