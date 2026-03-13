import type { FC } from "react";
import type { Data } from "../../../../features/dashboard/dominio/interfaces/types";
import { useNavigate } from "react-router-dom";
import { DesktopFullView } from "../componentes/panel-monitor/DesktopFullView";
import { ArrowLeft } from "lucide-react";

type Props = {
  data: Data;
};

export const TemplateFullView: FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-md hover:bg-white/100 transition-colors flex items-center gap-2 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver al editor</span>
      </button>
      <DesktopFullView data={data} />
    </div>
  );
}; 