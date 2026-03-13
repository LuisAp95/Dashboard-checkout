import React from "react";
import { useAppContext } from "../../../../context/AppContext";
import { useDivisePreview } from "../../../../context/device-preview-context";
import { X } from "lucide-react";

interface Modal {
  onClose: () => void;
  open?: boolean;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  onClose,
  children,
  maxWidth = "max-w-md",
  showCloseButton = true,
}: Modal) {
  const { states } = useAppContext();
  const { deviceType } = useDivisePreview();

  return (
    <div className="fixed inset-0 h-full bg-black/50 flex items-center justify-center z-50">
      <div
        style={{
          backgroundColor: states.bgModalColor,
          color: states.textColorModal,
        }}
        className={`rounded-[1.8rem] p-4 w-full ${maxWidth} relative shadow-lg shadow-gray-400 ${
          deviceType === "mobile" && "md:max-w-[345px]"
        }`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute cursor-pointer right-4 top-4 text-slate-500 bg-slate-100 rounded-full p-2 shadow-lg swadow-slate-500 z-10"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
