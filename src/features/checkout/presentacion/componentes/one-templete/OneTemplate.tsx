import { useState, useCallback, memo } from "react";
import { useAppContext } from "../../../../../context/AppContext";
import { useDivisePreview } from "../../../../../context/device-preview-context";
import type { Data } from "../../../../dashboard/dominio/interfaces/types";
import { InfoCobro } from "./infoPago/InfoCobrador";
import { Formulario } from "./formulario/Formulario";
import SuccessModal from "../utp/SuccesModal";
import Modal from "../../../utils/modal/Modal";
import VerificationModal from "../utp/VerificacionModal";
import ConfirmarDatos from "../confirmarDatos/ConfirmarDatos";
import FondoSvg from "../../../utils/FondoSvg";
import ConstellationBackground from "../../../utils/canva/ConstellationBackground";
import TerminoCondiciones from "../terminos/TerminoCondiciones";

// Memorizamos los componentes hijos
const MemoizedInfoCobro = memo(InfoCobro);
const MemoizedFormulario = memo(Formulario);
const MemoizedConfirmarDatos = memo(ConfirmarDatos);
const MemoizedVerificationModal = memo(VerificationModal);
const MemoizedSuccessModal = memo(SuccessModal);

export const OneTemplate: React.FC<Data> = memo((props) => {
  // Solo extraemos los estados específicos que necesitamos
  const { states, actions } = useAppContext();
  const {
    selecBgImage,
    isBgcolor,
    isBgFormulariocolor,
    isPosition,
    isOpenModal,
  } = states;
  const { deviceType } = useDivisePreview();

  const [showVerificationModal, setShowVerificationModal] =
    useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);

  // Memorizamos las funciones manejadoras
  const handleVerificationSuccess = useCallback(() => {
    setShowVerificationModal(false);
    setShowSuccessModal(true);
  }, []);

  const handleSuccessClose = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  const handleVerificacionDatos = useCallback(() => {
    actions.setIsOpenModal(false);
    setShowVerificationModal(true);
  }, [actions]);

  const handleCloseVerification = useCallback(() => {
    actions.setIsOpenModal(false);
  }, [actions]);

  const handleCloseVerificationModal = useCallback(() => {
    setShowVerificationModal(false);
  }, []);

  const handleOpenTermsModal = useCallback(() => {
    setIsTermsModalOpen(true);
  }, []);

  const handleCloseTermsModal = useCallback(() => {
    setIsTermsModalOpen(false);
  }, []);

  return (
    <div
      className={`${
        deviceType === "desktop"
          ? "flex flex-col w-full md:items-center md:m-auto h-screen  md:flex-row md:justify-center md:p-4 relative md:overflow-hidden"
          : "flex flex-col w-full"
      }`}
    >
      <ConstellationBackground />
      {deviceType === "desktop" && <FondoSvg />}
      <div
        style={{
          backgroundImage:
            deviceType === "desktop" && selecBgImage
              ? `url(${selecBgImage})`
              : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor:
            deviceType === "desktop"
              ? selecBgImage
                ? "transparent"
                : isBgcolor
              : isBgcolor,
        }}
        className={`flex flex-col w-full h-full flex-1 overflow-hidden ${
          deviceType === "desktop"
            ? "drop-shadow-2xl lg:h-[calc(100vh-200px)] media md:h-[calc(100vh-150px)] lg:min-h-[590px] md:flex-row md:max-w-[1300px] md:rounded-[3.5rem] md:overflow-hidden"
            : ""
        }`}
      >
        <section
          className={`flex w-full  h-1/2 ${
            deviceType === "desktop" ? "md:w-1/2 md:h-full md:p-[50px]" : ""
          }`}
        >
          <div
            className={`w-full h-full transition-all ease-in-out duration-700 translate-x-0 opacity-100 ${
              isPosition && deviceType === "desktop"
                ? "translate-x-[115%]"
                : "translate-x-0"
            }`}
          >
            <MemoizedInfoCobro
              {...props}
              onOpenTermsModal={handleOpenTermsModal}
            />
          </div>
        </section>

        <section
          style={{ backgroundColor: isBgFormulariocolor }}
          className={`flex flex-col h-1/2 md:h-auto
              ? "md:h-full md:py-8 rounded-t-[1.75rem] md:rounded-t-none"
              : "h-auto  rounded-t-[1.75rem]"
          } ${
            isPosition && deviceType === "desktop"
              ? "md:rounded-r-[3.5rem] md:w-[50%] md:rounded-l-none translate-x-[-100%]"
              : deviceType === "desktop"
                ? "md:w-[50%] md:rounded-l-[3.5rem] translate-x-0"
                : "translate-x-0"
          }`}
        >
          <MemoizedFormulario
            data={props}
            openUtp={actions.setIsOpenModal}
            datos={() => {}}
          />
        </section>

        {isOpenModal && (
          <Modal onClose={handleCloseVerification}>
            <div className="flex w-full mb-15">
              <h2 className="w-full absolute left-1/2 transform -translate-x-1/2 top-0 py-2 text-xl font-normal text-center">
                Confirmar Datos
              </h2>
            </div>
            <MemoizedConfirmarDatos onClose={handleVerificacionDatos} />
          </Modal>
        )}

        {showVerificationModal && (
          <Modal onClose={handleCloseVerificationModal}>
            <MemoizedVerificationModal onSuccess={handleVerificationSuccess} />
          </Modal>
        )}

        {showSuccessModal && (
          <Modal
            onClose={handleSuccessClose}
            maxWidth="md:max-w-[450px]"
            showCloseButton={false}
          >
            <MemoizedSuccessModal onClose={handleSuccessClose} />
          </Modal>
        )}

        {isTermsModalOpen && (
          <Modal
            onClose={handleCloseTermsModal}
            maxWidth="md:max-w-[700px]"
            showCloseButton={true}
          >
            <TerminoCondiciones />
          </Modal>
        )}
      </div>
    </div>
  );
});
