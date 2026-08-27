import { useState } from "react";
import ImageUpload from "../uploadImage/ImageUpload";
import LabelEditor from "../EditarLabel/LabelEditor";
import { TypographySelector } from "../../util/SelecFont";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

interface ConfigSidebarProps {
  onLogoUpload: (imageUrl: string) => void;
  onBackgroundUpload: (imageUrl: string) => void;
  onTemplate1BackgroundUpload: (imageUrl: string) => void;
  onSave: () => void;
}

export default function Features({
  onLogoUpload,
  onBackgroundUpload,
  onTemplate1BackgroundUpload,
}: ConfigSidebarProps) {
  const [openLabel, setOpenLabel] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLabelToggle = () => {
    setOpenLabel(!openLabel);
  };

  return (
    <div className="flex flex-col w-full gap-4 text-sm">
      <div className="space-y-4">
        <ImageUpload
          id="logo-upload"
          label="Subir logo"
          description="Sube el logo de tu empresa, recomendado fondo transparente (PNG, JPG, WEBP)"
          onImageUpload={onLogoUpload}
          maxSizeMB={2}
          acceptedFormats=".jpg, .jpeg, .png, .webp"
        />
      </div>
      <div className="space-y-4">
        <ImageUpload
          id="background-upload"
          label="Subir fondo"
          description="Sube una imagen para el fondo (recomendado: 1920x1080px)"
          onImageUpload={onBackgroundUpload}
          maxSizeMB={5}
          acceptedFormats=".jpg, .jpeg, .png, .webp"
        />
      </div>
      <div className="space-y-4">
        <ImageUpload
          id="template1-background-upload"
          label="Subir background"
          description="Sube una imagen para el background del template 1"
          onImageUpload={onTemplate1BackgroundUpload}
          maxSizeMB={5}
          acceptedFormats=".jpg, .jpeg, .png, .webp"
          recommendedDimensions={{ width: 1920, height: 1080, tolerance: 0.1 }}
        />
      </div>

      {/* Label Editor Section */}
      <div>
        <div
          onClick={handleLabelToggle}
          className="flex w-full h-10 items-center justify-between px-4 rounded-lg bg-[#1A0F17] hover:bg-[#AE7AA9]/40 cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="h-4 w-4 text-gray-400" />
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50 border border-gray-700"
                  >
                    Personaliza los nombres de los campos del formulario
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-gray-300 font-medium">Etiquetas Inputs</span>
          </div>
          <motion.div
            animate={{ rotate: openLabel ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            ▼
          </motion.div>
        </div>

        <AnimatePresence>
          {openLabel && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full mt-2 overflow-hidden bg-[#1A0F17] rounded-lg"
            >
              <LabelEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <TypographySelector />
    </div>
  );
}
