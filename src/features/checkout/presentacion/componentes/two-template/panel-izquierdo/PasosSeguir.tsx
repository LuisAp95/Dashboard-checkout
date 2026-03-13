import { Check, CreditCard, RefreshCcw, RotateCcwKey } from "lucide-react";
import { useAppContext } from "../../../../../../context/AppContext";
import type { Step } from "../TwoTemplate";
import { useDivisePreview } from "../../../../../../context/device-preview-context";
interface PasosSeguirProps {
  steps: Step[];
}

export default function PasosSeguir({ steps }: PasosSeguirProps) {
  const { deviceType } = useDivisePreview();
  const {  states } = useAppContext()

  const getIcon = (
    iconName: string,
    isCompleted: boolean,
    
  ) => {
    const className = "h-5 w-5";

    if (iconName === "check" && isCompleted) {
      return <Check className={className} />;
    } else if (iconName === "credit-card") {
      return <CreditCard className={className} />;
    } else if (iconName === "refresh-ccw") {
      return <RefreshCcw className={className} />;
    } else if (iconName === "rotate-ccw-key") {
      return <RotateCcwKey className={className} />;
    }

    return <Check className={className} />;
  };

  return (
    <div
      className={`flex flex-row ${deviceType === "desktop" && " md:flex-col"
        }`}>
      <h1 
      style={{color: states.textColorInfo}}
        className={` hidden ${deviceType === "desktop"
          && "md:flex text-blue-600 text-2xl font-bold mb-10"
          }`}>
        Pasos a seguir
      </h1>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={` flex mt-5 relative ${deviceType === "desktop"
            && "md:flex-col md:items-start md:mt-0"
            }`}>
          <div
            className={` flex flex-col ${deviceType === "desktop"
              && "md:flex-row md:items-center md:mb-2"
              }`}>
            <div
              className={`flex items-center gap-0 justify-center w-10 h-10 rounded-full ${step.completed
                ? "bg-green-100 text-green-500"
                : step.current
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-400"
                } ${deviceType === "desktop" && "md:gap-5"}`}
            >
              {getIcon(step.icon, step.completed)}
            </div>
            <span
            style={{color: step.current ? states.textColorInfo :"#6a7282" }}
              className={`ml-3 hidden  ${deviceType === "desktop"
                && ` ${step.current ? " md:flex md:font-medium" : " md:flex md:text-gray-500"}`}`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-10 h-0.5 bg-gray-200 mt-5 ${deviceType === "desktop"
                && "md:w-0.5 md:h-10 md:ml-5 md:mt-0"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
