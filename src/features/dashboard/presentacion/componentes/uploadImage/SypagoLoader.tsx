import React from "react";
import { motion } from "framer-motion";

interface SypagoLoaderProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  className?: string;
}

const SypagoLoader: React.FC<SypagoLoaderProps> = ({
  width = 80,
  height = 80,
  strokeColor = "#AE7AA9",
  className = "",
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: [0.94, 1.04, 1] }}
      transition={{
        opacity: { duration: 0.35 },
        scale: { duration: 1, ease: "easeOut" },
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 0.5,
      }}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      aria-label="Cargando"
    >
      <motion.img
        src="/images/SP.svg"
        alt="Sypago logo"
        width={width}
        height={height}
        style={{ filter: `drop-shadow(0 0 12px ${strokeColor}66)` }}
        animate={{ opacity: [0.7, 1, 0.8] }}
        transition={{
          duration: 1.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    </motion.div>
  );
};

export default SypagoLoader;
