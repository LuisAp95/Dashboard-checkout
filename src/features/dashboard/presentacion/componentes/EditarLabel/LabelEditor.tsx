import { useState, useEffect } from "react";
import { useAppContext } from "../../../../../context/AppContext";

interface LabelConfig {
  [key: string]: string;
}

const LabelEditor = () => {
  const { states, actions } = useAppContext();
  // Estado inicial con los labels por defecto
  const [labels, setLabels] = useState<LabelConfig>({
    Banco: states.labelBanco,
    Telefono: states.labelPhone,
    Cuenta: states.labelCuenta,
    Documento: states.labelCedula,
  });

  const handleLabelChange = (field: string, newLabel: string) => {
    setLabels((prev) => ({
      ...prev,
      [field]: newLabel,
    }));
  };

  useEffect(() => {
    actions.setLabelBanco(labels.Banco ? labels.Banco : "Banco");
    actions.setLabelPhone(labels.Telefono ? labels.Telefono : "Telefono");
    actions.setLabelCedula(
      labels.Documento ? labels.Documento : "Numero de Documento"
    );
    actions.setLabelCuenta(labels.Cuenta ? labels.Cuenta : "Numero de Cuenta");
  }, [labels]);

  return (
    <div className="flex flex-col gap-3 p-2">
      {Object.entries(labels).map(([field, label]) => (
        <div key={field} className="flex justify-between items-center">
          <label htmlFor={`${field}-input`} className="text-gray-300">{field}:</label>
          <input
            id={`${field}-input`}
            type="text"
            value={label}
            onChange={(e) => handleLabelChange(field, e.target.value)}
            className="py-1 border-b border-b-gray-500 bg-[#AE7AA9]/20 text-gray-300 px-4 cursor-pointer focus:outline-none focus:border-b-[#0065BB] rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default LabelEditor;
