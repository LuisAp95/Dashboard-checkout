import type React from "react";
import { useState, useCallback } from "react";
import { Upload, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SypagoLoader from "./SypagoLoader";

const API_URL = "http://localhost:8080";

interface ImageUploadProps {
  id: string;
  label: string;
  description: string;
  onImageUpload: (imageUrl: string) => void;
  maxSizeMB: number;
  acceptedFormats?: string;
  recommendedDimensions?: {
    width: number;
    height: number;
    tolerance?: number;
  };
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
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const loadImages = useCallback(async () => {
  setIsLoadingImages(true);

  try {
    const response = await fetch(`${API_URL}/api/images`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las imágenes");
    }

    const imageNames: string[] = await response.json();
    setImages(imageNames);
  } catch (error) {
    console.error("Error al cargar imágenes:", error);
    alert("No se pudieron cargar las imágenes existentes.");
  } finally {
    setIsLoadingImages(false);
  }
  }, []);

  const handleOpenImageSelector = useCallback(() => {
  setIsOpen(true);
  void loadImages();
  }, [loadImages]);

  const handleSelectImage = useCallback(
  (imageName: string) => {
    const imagePath = `/images/${imageName}`;

    setPreview(`${API_URL}${imagePath}`);
    onImageUpload(imagePath);
    setIsOpen(false);
  },
  [onImageUpload]
  );

  const uploadImage = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_URL}/api/uploads`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "No se pudo subir la imagen");
        }

        const result: { path: string } = await response.json();

        setPreview(`${API_URL}${result.path}`);
        onImageUpload(result.path);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("No se pudo subir la imagen.");
      }
    },
    [onImageUpload]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Por favor, sube un archivo de imagen válido.");
        return;
      }

      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      const acceptedExtensions = acceptedFormats
        ? acceptedFormats
            .split(",")
            .map((extension) => extension.trim().replace(".", "").toLowerCase())
        : ["jpg", "jpeg", "png", "webp"];

      if (
        fileExtension &&
        !acceptedExtensions.includes(fileExtension)
      ) {
        alert(
          `Formato no válido. Usa: ${acceptedExtensions
            .map((extension) => `.${extension}`)
            .join(", ")}`
        );
        return;
      }

      const fileSizeInMB = file.size / (1024 * 1024);

      if (fileSizeInMB > maxSizeMB) {
        alert(`La imagen supera el peso máximo permitido de ${maxSizeMB} MB.`);
        return;
      }

      if (!recommendedDimensions) {
        void uploadImage(file);
        return;
      }

      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      const tolerance = recommendedDimensions.tolerance ?? 0.1;

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const widthDiff =
          Math.abs(image.width - recommendedDimensions.width) /
          recommendedDimensions.width;

        const heightDiff =
          Math.abs(image.height - recommendedDimensions.height) /
          recommendedDimensions.height;

        if (widthDiff > tolerance || heightDiff > tolerance) {
          const recommendedText = `${recommendedDimensions.width}x${recommendedDimensions.height}px`;
          const actualText = `${image.width}x${image.height}px`;
          const tolerancePercent = Math.round(tolerance * 100);

          const shouldContinue = confirm(
            `Las dimensiones recomendadas son ${recommendedText} (±${tolerancePercent}%).\n\n` +
              `La imagen actual es ${actualText}.\n\n` +
              "¿Deseas continuar con esta imagen?"
          );

          if (!shouldContinue) {
            return;
          }
        }

        void uploadImage(file);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        alert("Error al cargar la imagen. Intenta con otra.");
      };

      image.src = objectUrl;
    },
    [
      acceptedFormats,
      maxSizeMB,
      recommendedDimensions,
      uploadImage,
    ]
  );

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    onImageUpload("");
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <div className="relative flex h-10 w-full items-center justify-between rounded-lg bg-[#1A0F17] px-4 transition-all duration-200 hover:bg-[#AE7AA9]/40">
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
                className="absolute left-6 top-1/2 z-50 w-64 -translate-y-1/2 rounded border border-gray-700 bg-gray-900 p-2 text-xs text-white shadow-lg"
              >
                {description} (Máx: {maxSizeMB} MB
                {recommendedDimensions &&
                  `, recomendado: ${recommendedDimensions.width}x${recommendedDimensions.height}px`}
                )
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={handleOpenImageSelector}
          className="flex flex-1 cursor-pointer items-center justify-end gap-2"
        >
          <span className="font-medium text-gray-300">{label}</span>
          <Upload className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 rounded-lg border border-gray-700 bg-[#1A0F17] p-3"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">
          Imágenes disponibles
        </span>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-gray-400 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoadingImages ? (
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <SypagoLoader width={52} height={52} strokeColor="#AE7AA9" />
          <p className="text-xs text-gray-400">Cargando imágenes...</p>
        </div>
      ) : images.length === 0 ? (
        <p className="text-xs text-gray-400">
          No hay imágenes disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {images.map((imageName) => (
            <button
              key={imageName}
              type="button"
              onClick={() => handleSelectImage(imageName)}
              className="group overflow-hidden rounded border border-gray-700 bg-black/20 hover:border-[#AE7AA9]"
            >
              <img
                src={`${API_URL}/images/${imageName}`}
                alt={imageName}
                className="h-20 w-full object-contain"
              />

              <span className="block truncate px-1 py-1 text-xs text-gray-400 group-hover:text-white">
                {imageName}
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => document.getElementById(id)?.click()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-[#AE7AA9]/30 px-3 py-2 text-sm text-gray-200 hover:bg-[#AE7AA9]/50"
      >
        <Upload className="h-4 w-4" />
              Subir desde mi computadora
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="flex flex-col gap-2 rounded-lg border border-gray-600 bg-gray-700/30 p-4">
              <div className="max-h-48 w-full overflow-hidden rounded">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="h-full w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center justify-center gap-2 rounded py-2 text-red-400 transition-colors duration-200 hover:bg-red-900/30"
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