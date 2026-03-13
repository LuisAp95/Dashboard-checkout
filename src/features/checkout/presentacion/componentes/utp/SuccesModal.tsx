import { useAppContext } from "../../../../../context/AppContext";
import { Succes } from "../../../../../assets/svg/Svg";
import { useDivisePreview } from "../../../../../context/device-preview-context";

interface SuccessModalProps {
  onClose: () => void;
}
const SuccessModal = ({ onClose }: SuccessModalProps) => {
  const { states } = useAppContext();
  const { deviceType } = useDivisePreview();

  return (
    <div
      className={`p-2 flex flex-col items-center  ${
        deviceType === "desktop" && "md:h-auto"
      }`}
    >
      <div className="flex items-center justify-center ">
        <Succes />
      </div>
      <div
        className="flex flex-col justify-center items-center"
        style={{ color: states.textColorModal }}
      >
        <h2 className="font-semibold my-[20px]">Operación Aceptada</h2>
        <div className="w-full flex flex-col mb-10 gap-2 ">
          <div className="flex justify-between">
            <p className="">Fecha:</p>{" "}
            <p
              style={{ color: states.textModalColorInfo }}
              className="font-light"
            >
              12/12/2025, 9:44:25
            </p>
          </div>
          <div className="flex justify-between gap-2">
            <p className="">Banco Pagador:</p>{" "}
            <p
              style={{ color: states.textModalColorInfo }}
              className="font-light"
            >
              Banco Central de Venezuela
            </p>
          </div>
          <div className="flex justify-between">
            <p className="">Cedula Pagador:</p>{" "}
            <p
              style={{ color: states.textModalColorInfo }}
              className="font-light"
            >
              V123456789
            </p>
          </div>
          <div className="flex justify-between">
            <p className="">Ref.Sypago:</p>{" "}
            <p
              style={{ color: states.textModalColorInfo }}
              className="font-light"
            >
              ECD93825A725
            </p>
          </div>
          <div className="flex justify-between">
            <p className="">Ref.Banco:</p>{" "}
            <p
              style={{ color: states.textModalColorInfo }}
              className=" font-light"
            >
              62873754
            </p>
          </div>
          <div className="flex justify-between">
            <p className="">Concepto:</p>{" "}
            <p
              style={{ color: states.textModalColorInfo }}
              className=" font-light"
            >
              Pago de prueba
            </p>
          </div>
          <div className="flex justify-between">
            <p className="">Monto:</p>{" "}
            <p
              style={{ color: states.textModalColorInfo }}
              className="font-light"
            >
              10.00 Bs.
            </p>
          </div>
        </div>
      </div>
      <button
        style={{
          backgroundColor: states.bgButtonColorForm,
          color: states.textColorBotonForm,
        }}
        onClick={onClose}
        className="text-center p-2 bg-primary  mb-[20px]  
         cursor-pointer text-sm rounded-2xl  uppercase w-[100px] h-[40px] font-light"
      >
        ok
      </button>
    </div>
  );
};

export default SuccessModal;
