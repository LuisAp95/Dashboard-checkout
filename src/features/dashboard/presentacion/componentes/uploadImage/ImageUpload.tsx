import type React from "react";
import { useState, useCallback } from "react";
import { Upload, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  id: string;
  label: string;
  description: string;
  onImageUpload: (imageUrl: string) => void;
  maxSizeMB: number;
  acceptedFormats?: string;
  recommendedDimensions?: { width: number; height: number; tolerance?: number };
}

export default function ImageUpload({
  id,
  label,
  description,
  onImageUpload,
  maxSizeMB,
  acceptedFormats,
  recommendedDimensions,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor, sube un archivo de imagen válido.");
        return;
      }

      // Validar formato
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const acceptedExtensions = acceptedFormats
        ? acceptedFormats.split(",").map((ext) => ext.trim().replace(".", ""))
        : ["jpg", "jpeg", "png", "webp"];

      if (fileExtension && !acceptedExtensions.includes(fileExtension)) {
        alert(
          `Formato no válido. Por favor, sube un archivo en formato: ${acceptedExtensions
            .map((ext) => `.${ext}`)
            .join(", ")}`
        );
        return;
      }

      // Validar tamaño
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeMB) {
        alert(`La imagen supera el peso máximo permitido de ${maxSizeMB}MB.`);
        return;
      }

      // Validar dimensiones recomendadas si se especifican
      if (recommendedDimensions) {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        const tolerance = recommendedDimensions.tolerance || 0.1; // 10% de tolerancia por defecto

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);

          const widthDiff =
            Math.abs(img.width - recommendedDimensions.width) /
            recommendedDimensions.width;
          const heightDiff =
            Math.abs(img.height - recommendedDimensions.height) /
            recommendedDimensions.height;

          // Si las dimensiones están fuera de la tolerancia, mostrar advertencia pero permitir la carga
          if (widthDiff > tolerance || heightDiff > tolerance) {
            const recommendedText = `${recommendedDimensions.width}x${recommendedDimensions.height}px`;
            const actualText = `${img.width}x${img.height}px`;
            const tolerancePercent = Math.round(tolerance * 100);

            const userConfirm = confirm(
              `Advertencia: Las dimensiones recomendadas son ${recommendedText} (±${tolerancePercent}%).\n\n` +
                `La imagen actual es ${actualText}.\n\n` +
                `¿Deseas continuar con esta imagen?`
            );

            if (!userConfirm) {
              return;
            }
          }

          // Proceder con la carga
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            setPreview(imageUrl);
            onImageUpload(imageUrl);
          };
          reader.readAsDataURL(file);
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          alert(
            "Error al cargar la imagen. Por favor, intenta con otra imagen."
          );
        };

        img.src = objectUrl;
        return;
      }

      // Si no hay validación de dimensiones, proceder normalmente
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setPreview(imageUrl);
        onImageUpload(imageUrl);
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload, maxSizeMB, acceptedFormats, recommendedDimensions]
  );

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    onImageUpload("");
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <div className="flex w-full h-10 items-center justify-between px-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-all duration-200 relative">
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
                {description} (Máx: {maxSizeMB}MB
                {recommendedDimensions &&
                  `, Dimensiones recomendadas: ${recommendedDimensions.width}x${recommendedDimensions.height}px`}
                )
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          onClick={() => document.getElementById(id)?.click()}
          className="flex items-center gap-2 flex-1 justify-end"
        >
          <span className="text-gray-300 font-medium">{label}</span>
          <Upload className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <input
        id={id}
        type="file"
        accept={acceptedFormats || "image/jpeg,image/png,image/webp"}
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <div className="flex flex-col gap-2 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <div className="w-full max-h-48 overflow-hidden rounded">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/30 rounded transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                Eliminar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
