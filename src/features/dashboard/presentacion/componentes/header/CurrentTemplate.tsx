import { FileText } from "lucide-react";
import { useAppContext } from "../../../../../context/AppContext";

export default function CurrentTemplate() {
  const { states } = useAppContext();
  const templateLabel = states.selectedTemplateName || (
    states.hasActiveTemplate
      ? `Tema ${states.selecteTemplate}`
      : "Nuevo template"
  );

  return (
    <div
      className="hidden sm:flex items-center gap-2 max-w-[240px] text-sm text-gray-300"
      title={`Template actual: ${templateLabel}`}
    >
      <FileText className="w-4 h-4 shrink-0 text-[#AE7AA9]" />
      <span className="truncate">{templateLabel}</span>
    </div>
  );
}