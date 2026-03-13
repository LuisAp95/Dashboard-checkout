import { useState, memo, useCallback } from "react";
import { useAppContext } from "../../../../../context/AppContext";
import { useDivisePreview } from "../../../../../context/device-preview-context";
import { ButonCuentaPhone } from "../../../utils/buttom/Buttons";
import { CustomSelect } from "../../../utils/Select/CustomSelect";
import { SelectSinBorder } from "../../../utils/Select/SelectSinBorder";
import { SelectFloat } from "../../../utils/Select/SelectFloat";
import { InputField } from "../../../utils/Input/InputField";
import { InputSinBorder } from "../../../utils/Input/InputSinBorder";
import { InputFloat } from "../../../utils/Input/InputFloat";

import {
  isRequired,
  isOnlyNumbers,
  isValidPhoneVE,
  isValidAccountVE,
  validateBankCodeMatch,
} from "../../../utils/validator";

interface InputSelectProps {
  banks: { label: string; value: string }[];
  infoF?: string[];
  onNext?: () => void;
  openUtp: React.Dispatch<React.SetStateAction<boolean>>;
  datos: React.Dispatch<React.SetStateAction<FormState>>;
}

const initialState = {
  banco: "",
  cuenta: "",
  telefono: "",
  documento: "",
  documentType: "V",
};
type FormState = typeof initialState;
type Errors = { [K in keyof FormState]?: string | null };

// Memorizamos los componentes hijos
const MemoizedCustomSelect = memo(CustomSelect);
const MemoizedSelectSinBorder = memo(SelectSinBorder);
const MemoizedSelectFloat = memo(SelectFloat);
const MemoizedInputField = memo(InputField);
const MemoizedInputSinBorder = memo(InputSinBorder);
const MemoizedInputFloat = memo(InputFloat);
const MemoizedButonCuentaPhone = memo(ButonCuentaPhone);

const InputSelecteTemplet: React.FC<InputSelectProps> = memo(
  ({ banks, openUtp, datos, onNext }) => {
    const [cuenta, setCuenta] = useState<string>("Telefono");
    const {
      selecteTemplate,
      selectImputT,
      labelBanco,
      labelPhone,
      labelCuenta,
      labelCedula,
    } = useAppContext().states;
    const { deviceType } = useDivisePreview();
    const [form, setForm] = useState<FormState>(initialState);
    const [errors, setErrors] = useState<Errors>({});

    const documentTypes = [
      { label: "V", value: "V" },
      { label: "E", value: "E" },
      { label: "P", value: "P" },
      { label: "J", value: "J" },
      { label: "G", value: "G" },
    ];

    const handleChange = useCallback(
      (name: string, value: string) => {
        if (name === "cuenta") {
          const error =
            isRequired(value) ||
            isOnlyNumbers(value) ||
            isValidAccountVE(value) ||
            validateBankCodeMatch(value, form.banco);
          setErrors((prev) => ({ ...prev, cuenta: error }));
        }
        if (name === "banco") {
          const error = isRequired(value);
          const cuentaError =
            isRequired(form.cuenta) ||
            isOnlyNumbers(form.cuenta) ||
            isValidAccountVE(form.cuenta) ||
            validateBankCodeMatch(form.cuenta, value);
          setErrors((prev) => ({
            ...prev,
            banco: error,
            cuenta: cuentaError,
          }));
        }
        if (name === "telefono") {
          const error =
            isRequired(value) || isOnlyNumbers(value) || isValidPhoneVE(value);
          setErrors((prev) => ({ ...prev, telefono: error }));
        }
        setForm((prev) => ({ ...prev, [name]: value }));
      },
      [form.banco, form.cuenta]
    );

    const validate = useCallback((): boolean => {
      const cuentaError =
        isRequired(form.cuenta) ||
        isValidAccountVE(form.cuenta) ||
        isOnlyNumbers(form.cuenta) ||
        validateBankCodeMatch(form.cuenta, form.banco);

      const telefonoError =
        isRequired(form.telefono) ||
        isValidPhoneVE(form.telefono) ||
        isOnlyNumbers(form.telefono);

      const isAtLeastOneValid = cuentaError === null || telefonoError === null;

      const newErrors: Errors = {
        banco: isRequired(form.banco),
        cuenta: isAtLeastOneValid ? null : cuentaError,
        telefono: isAtLeastOneValid ? null : telefonoError,
        documento: isRequired(form.documento) || isOnlyNumbers(form.documento),
      };

      setErrors(newErrors);
      return Object.values(newErrors).every((e) => e === null);
    }, [form]);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
          if (selecteTemplate === "2" && onNext) {
            onNext();
          } else {
            datos(form);
            openUtp(true);
          }
          setErrors({});
        }
      },
      [validate, selecteTemplate, onNext, datos, form, openUtp]
    );

    const renderForm = useCallback(() => {
      const commonFormClasses = `flex flex-col gap-5 ${
        deviceType === "desktop" && "md:gap-6"
      }`;
      const commonProps = {
        label: cuenta === "Telefono" ? labelPhone : labelCuenta,
        name: cuenta === "Telefono" ? "telefono" : "cuenta",
        value: cuenta === "Telefono" ? form.telefono : form.cuenta,
        onChange: handleChange,
        validators:
          cuenta === "Telefono"
            ? [isRequired, isOnlyNumbers, isValidPhoneVE]
            : [isRequired, isOnlyNumbers, isValidAccountVE],
        error: cuenta === "Telefono" ? errors.telefono : errors.cuenta,
      };

      const documentProps = {
        label: labelCedula,
        name: "documento",
        value: form.documento,
        onChange: handleChange,
        validators: [isRequired, isOnlyNumbers],
        error: errors.documento,
      };

      switch (selectImputT) {
        case "2":
          return (
            <form
              id="formTemplate"
              onSubmit={handleSubmit}
              className={commonFormClasses}
            >
              <MemoizedCustomSelect
                label={labelBanco}
                options={banks}
                value={form.banco}
                onChange={(val) => handleChange("banco", val)}
                error={errors.banco}
                isBank={true}
              />
              <MemoizedButonCuentaPhone setCuenta={setCuenta} cuenta={cuenta} />
              <MemoizedInputField {...commonProps} />
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="w-[20%]">
                  <MemoizedCustomSelect
                    label="Doc"
                    options={documentTypes}
                    value={form.documentType}
                    onChange={(val) => handleChange("documentType", val)}
                    error={null}
                    openUpwards={true}
                    isDocumentType={true}
                  />
                </div>
                <div className="w-[80%]">
                  <MemoizedInputField {...documentProps} />
                </div>
              </div>
            </form>
          );
        case "3":
          return (
            <form
              id="formTemplate"
              onSubmit={handleSubmit}
              className={commonFormClasses}
            >
              <MemoizedSelectFloat
                label={labelBanco}
                options={banks}
                value={form.banco}
                onChange={(val) => handleChange("banco", val)}
                error={errors.banco}
                isBank={true}
              />
              <MemoizedButonCuentaPhone setCuenta={setCuenta} cuenta={cuenta} />
              <MemoizedInputFloat {...commonProps} />
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="w-[20%]">
                  <MemoizedSelectFloat
                    label="Doc"
                    options={documentTypes}
                    value={form.documentType}
                    onChange={(val) => handleChange("documentType", val)}
                    error={null}
                    openUpwards={true}
                    isDocumentType={true}
                  />
                </div>
                <div className="w-[80%]">
                  <MemoizedInputFloat {...documentProps} />
                </div>
              </div>
            </form>
          );
        default:
          return (
            <form
              id="formTemplate"
              onSubmit={handleSubmit}
              className={commonFormClasses}
            >
              <MemoizedSelectSinBorder
                label={labelBanco}
                options={banks}
                value={form.banco}
                onChange={(val) => handleChange("banco", val)}
                error={errors.banco}
                isBank={true}
              />
              <MemoizedButonCuentaPhone setCuenta={setCuenta} cuenta={cuenta} />
              <MemoizedInputSinBorder {...commonProps} />
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="w-[20%]">
                  <MemoizedSelectSinBorder
                    label="Doc"
                    options={documentTypes}
                    value={form.documentType}
                    onChange={(val) => handleChange("documentType", val)}
                    error={null}
                    openUpwards={true}
                    isDocumentType={true}
                  />
                </div>
                <div className="w-[80%]">
                  <MemoizedInputSinBorder {...documentProps} />
                </div>
              </div>
            </form>
          );
      }
    }, [
      banks,
      cuenta,
      deviceType,
      errors,
      form,
      handleChange,
      handleSubmit,
      labelBanco,
      labelCedula,
      labelCuenta,
      labelPhone,
      selectImputT,
      documentTypes,
    ]);

    return renderForm();
  }
);

InputSelecteTemplet.displayName = "InputSelecteTemplet";

export default InputSelecteTemplet;
