import React, { memo, useRef, useEffect, useCallback } from "react";
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimate,
} from "framer-motion";
import { Check } from "lucide-react";
import { useMeasure } from "react-use";

interface Option {
  label: string;
  value: string;
  active?: boolean;
}

interface MobileDropdownProps {
  open: boolean;
  isBank: boolean;
  isMobile: boolean;
  isDocumentType?: boolean;
  searchTerm: string;
  value: string;
  filteredOptions: Option[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  dropdownStyles: any;
  dropdownClasses: string;
  inputHoverColor: string;
  isBgFormulariocolor: string;
  textColorform: string;
  selecteTemplate?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionSelect: (code: string) => void;
  onClose: () => void;
}

const MotionUl = memo(motion.ul);

export const MobileDropdown: React.FC<MobileDropdownProps> = memo(
  ({
    open,
    isBank,
    isMobile,
    isDocumentType = false,
    searchTerm,
    value,
    filteredOptions,
    searchInputRef,
    dropdownStyles,
    dropdownClasses,
    inputHoverColor,
    isBgFormulariocolor,
    textColorform,
    selecteTemplate,
    onSearchChange,
    onOptionSelect,
    onClose,
  }) => {
    const [scope, animate] = useAnimate();
    const [drawerRef, { height }] = useMeasure<HTMLDivElement>();
    const controls = useDragControls();
    const y = useMotionValue(0);
    const [isClosing, setIsClosing] = React.useState(false);
    const closeTimeoutRef = useRef<number | null>(null);
    const listContainerRef = useRef<HTMLDivElement | null>(null);

    const dragDuration = useRef({ init: 0, finish: 0 });
    const dragPosition = useRef({ init: { y: 0 }, finish: { y: 0 } });

    // Bloquear interacciones del body cuando el modal está abierto (SOLO MÓVIL)
    useEffect(() => {
      if (!open || (!isBank && !isDocumentType) || !isMobile) return;

      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      // Bloquear scroll y eventos en el body
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      // Prevenir eventos touch en todo el documento
      const preventTouch = (e: TouchEvent) => {
        // Solo prevenir si el target no está dentro del modal
        const modal = document.querySelector("#drawer");
        if (modal && !modal.contains(e.target as Node)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener("touchstart", preventTouch, {
        passive: false,
        capture: true,
      });
      document.addEventListener("touchmove", preventTouch, {
        passive: false,
        capture: true,
      });
      document.addEventListener("touchend", preventTouch, {
        passive: false,
        capture: true,
      });

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;

        // IMPORTANTE: Usar las mismas opciones que al agregar el listener
        document.removeEventListener("touchstart", preventTouch, {
          passive: false,
          capture: true,
        } as any);
        document.removeEventListener("touchmove", preventTouch, {
          passive: false,
          capture: true,
        } as any);
        document.removeEventListener("touchend", preventTouch, {
          passive: false,
          capture: true,
        } as any);
      };
    }, [open, isBank, isDocumentType, isMobile]);

    const handleClose = useCallback(async () => {
      // Prevenir múltiples ejecuciones simultáneas
      if (isClosing) return;
      setIsClosing(true);

      try {
        const yStart = typeof y.get() === "number" ? y.get() : 0;

        // Verificar que los elementos existen antes de animar
        const drawerElement = document.querySelector("#drawer");
        const currentHeight = height || 0;
        if (drawerElement && currentHeight > 0) {
          animate("#drawer", {
            y: [yStart, currentHeight],
          });
        }

        if (scope.current) {
          await animate(scope.current, {
            opacity: [1, 0],
          });
        }
      } catch (error) {
        // Si hay error en la animación, simplemente ignorarlo
        console.debug("Animation error:", error);
      } finally {
        // Agregar un delay crítico antes de cerrar para evitar click-through
        closeTimeoutRef.current = window.setTimeout(() => {
          setIsClosing(false);
          onClose();
        }, 100); // Delay mínimo pero suficiente para evitar propagación
      }
    }, [isClosing, height, y, animate, scope, onClose]);

    // Cleanup del timeout al desmontar
    useEffect(() => {
      return () => {
        if (closeTimeoutRef.current !== null) {
          window.clearTimeout(closeTimeoutRef.current);
        }
      };
    }, []);

    // Variables para detectar si es un tap o un scroll
    const touchStartY = useRef<number>(0);
    const touchStartTime = useRef<number>(0);

    // Detectar clics fuera del drawer para cerrarlo (SOLO MÓVIL)
    const handleCloseRef = useRef(handleClose);
    useEffect(() => {
      handleCloseRef.current = handleClose;
    }, [handleClose]);

    // Resetear estado cuando se cierra o cambia el dispositivo
    useEffect(() => {
      if (!open) {
        setIsClosing(false);
        if (closeTimeoutRef.current !== null) {
          window.clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      }
    }, [open]);

    useEffect(() => {
      if (!open || (!isBank && !isDocumentType) || !isMobile || isClosing)
        return;

      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        const drawer = document.querySelector("#drawer");

        // Si el clic está fuera del drawer, cerrar
        if (drawer && !drawer.contains(target)) {
          handleCloseRef.current();
        }
      };

      // Usar capture para detectar antes que otros handlers
      document.addEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
      document.addEventListener("touchstart", handleClickOutside, {
        capture: true,
      });

      return () => {
        document.removeEventListener("mousedown", handleClickOutside, {
          capture: true,
        } as any);
        document.removeEventListener("touchstart", handleClickOutside, {
          capture: true,
        } as any);
      };
    }, [open, isBank, isDocumentType, isMobile, isClosing]);

    // Event listeners simplificados para las opciones de la lista
    useEffect(() => {
      const listContainer = listContainerRef.current;
      if (!listContainer || !open || (!isBank && !isDocumentType) || !isMobile)
        return;

      const handleTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const listItem = target.closest("li[data-option]");

        if (listItem) {
          // NO hacer preventDefault aquí para permitir scroll
          touchStartY.current = e.touches[0].clientY;
          touchStartTime.current = Date.now();
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const listItem = target.closest("li[data-option]") as HTMLElement;

        if (listItem) {
          // Verificar si la opción está deshabilitada
          const isDisabled = listItem.getAttribute("data-disabled") === "true";
          if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }

          const touchEndY = e.changedTouches[0].clientY;
          const touchDuration = Date.now() - touchStartTime.current;
          const touchDistance = Math.abs(touchEndY - touchStartY.current);

          // Solo procesar como click si no fue un scroll (movimiento < 10px y duración < 300ms)
          if (touchDistance < 10 && touchDuration < 300) {
            e.preventDefault();
            e.stopPropagation();

            if (isClosing) return;

            const optionCode = listItem.getAttribute("data-option");
            if (optionCode) {
              onOptionSelect(optionCode);

              requestAnimationFrame(() => {
                handleClose();
              });
            }
          }
        }
      };

      // Agregar listeners - ya no necesitamos passive: false en touchstart
      listContainer.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      listContainer.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });

      return () => {
        listContainer.removeEventListener("touchstart", handleTouchStart);
        listContainer.removeEventListener("touchend", handleTouchEnd);
      };
    }, [
      open,
      isBank,
      isDocumentType,
      isMobile,
      isClosing,
      onOptionSelect,
      handleClose,
    ]);

    // Calcular altura según el selecteTemplate
    const getDropdownHeight = () => {
      if (isBank || isDocumentType) {
        return selecteTemplate === "2" ? "70vh" : "100%";
      }
      return dropdownStyles.height || "100%";
    };

    // Para móvil banco, usar el sistema de drag mejorado
    if (!open) return null;

    // Si no es móvil o no es banco/documentType, mostrar dropdown normal
    if (!isMobile || (!isBank && !isDocumentType)) {
      const modifiedDropdownStyles = {
        ...dropdownStyles,
      };

      return (
        <MotionUl
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={modifiedDropdownStyles}
          className={dropdownClasses}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => {
              const isSelected = opt.value === value;
              const isDisabled = opt.active === false;
              return (
                <li
                  key={i}
                  aria-disabled={isDisabled}
                  className={`p-4 border-b border-gray-200 last:border-b-0 transition-colors text-center ${
                    isDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : `cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "hover:bg-blue-100"
                        }`
                  }`}
                  onClick={() => {
                    if (isDisabled) return;
                    onOptionSelect(opt.value);
                  }}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span
                      className={
                        isSelected && !isDisabled
                          ? "font-medium text-blue-600"
                          : ""
                      }
                    >
                      {isDocumentType
                        ? opt.value
                        : isBank
                        ? `${opt.value} - ${opt.label}`
                        : opt.label}
                    </span>
                    {isSelected && !isDisabled && (
                      <Check
                        size={20}
                        className="text-blue-600 ml-2 flex-shrink-0"
                      />
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="p-4 text-center text-gray-500">
              No se encontraron resultados
            </li>
          )}
        </MotionUl>
      );
    }

    // Renderizado para móvil con drag fluido
    return (
      <motion.div
        ref={scope}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeInOut" }}
        className="fixed inset-0 bg-black/30 h-full w-full z-[9999] flex justify-center items-center"
        style={{
          pointerEvents: isClosing ? "none" : "auto",
          touchAction: "none",
        }}
      >
        <motion.div
          id="drawer"
          ref={drawerRef}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          onDragStart={(_, info) => {
            dragDuration.current.init = new Date().getTime();
            dragPosition.current.init = { y: info.point.y };
          }}
          onDragEnd={(_, info) => {
            dragDuration.current.finish = new Date().getTime();
            dragPosition.current.finish = { y: info.point.y };
            const currentHeight = height || 0;
            const toLowCondition =
              currentHeight > 0 && y.get() >= currentHeight / 2.5;
            const toFastCondition =
              y.get() < 200 &&
              dragDuration.current.finish - dragDuration.current.init < 300;
            const upDirectionCondition =
              dragPosition.current.init.y > dragPosition.current.finish.y;

            if (upDirectionCondition) return;
            if (toLowCondition || toFastCondition) {
              handleClose();
            }
          }}
          drag="y"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 1 }}
          style={{
            y,
            height: getDropdownHeight(),
            pointerEvents: isClosing ? "none" : "auto",
            touchAction: "pan-y",
          }}
          className="absolute flex flex-col bottom-0 w-full bg-white rounded-t-3xl shadow-2xl"
        >
          {/* Handle de drag mejorado - SOLO ESTE ELEMENTO CONTROLA EL DRAG */}
          <div
            className="group/drag h-[45px] w-full flex justify-center p-4 shadow-sm cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={(e) => {
              e.stopPropagation();
              controls.start(e);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className="h-[5px] w-[60px] rounded-full group-active/drag:opacity-100 group-hover/drag:opacity-100 duration-200"
              style={{
                backgroundColor: inputHoverColor,
                opacity: 0.5,
              }}
            />
          </div>

          {/* Barra de búsqueda sticky - solo para bancos */}
          {!isDocumentType && (
            <div
              className="sticky top-0 bg-white z-10 px-4 pb-4"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={onSearchChange}
                  placeholder="Buscar banco..."
                  autoFocus={false}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: isBgFormulariocolor,
                    color: textColorform,
                    borderColor: inputHoverColor,
                    boxShadow: `0 0 0 0px ${inputHoverColor}`,
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${inputHoverColor}40`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = `0 0 0 0px ${inputHoverColor}`;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>
          )}

          {/* Lista scrolleable con scroll suave */}
          <div
            ref={listContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
            }}
          >
            {filteredOptions.length > 0 ? (
              <ul>
                {filteredOptions.map((opt, i) => {
                  const isSelected = opt.value === value;
                  const isDisabled = opt.active === false;
                  return (
                    <li
                      key={i}
                      data-option={opt.value}
                      data-disabled={isDisabled ? "true" : "false"}
                      aria-disabled={isDisabled}
                      className={`p-4 border-b border-gray-200 last:border-b-0 transition-all duration-150 text-left ${
                        isDisabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : `cursor-pointer ${
                              isSelected ? "bg-blue-50" : "active:bg-blue-100"
                            }`
                      }`}
                      onClick={(e) => {
                        // Fallback para desktop
                        e.preventDefault();
                        e.stopPropagation();

                        if (isClosing || isDisabled) return;
                        onOptionSelect(opt.value);
                        handleClose();
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                      }}
                      style={{
                        WebkitTapHighlightColor: "transparent",
                        touchAction: "pan-y",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`${
                            isSelected && !isDisabled
                              ? "font-medium text-blue-600"
                              : ""
                          } flex-1`}
                        >
                          {isDocumentType
                            ? opt.value
                            : isBank
                            ? `${opt.value} - ${opt.label}`
                            : opt.label}
                        </span>
                        {isSelected && !isDisabled && (
                          <Check
                            size={20}
                            className="text-blue-600 ml-2 flex-shrink-0"
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No se encontraron bancos
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

MobileDropdown.displayName = "MobileDropdown";
