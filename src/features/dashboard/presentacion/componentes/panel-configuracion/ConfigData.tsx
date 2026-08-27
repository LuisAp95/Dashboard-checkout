import type { ChangeEvent } from "react";
import type { Data } from "../../../dominio/interfaces/types";

interface ConfigDataProps {
  data: Data;
  onChange: (field: keyof Pick<Data, "companyName" | "companyRif" | "description" | "totalAmount">, value: string) => void;
}

const fields: Array<{
  key: keyof Pick<Data, "companyName" | "companyRif" | "description" | "totalAmount">;
  label: string;
  type?: string;
}> = [
  { key: "companyName", label: "Nombre del cobrador" },
  { key: "companyRif", label: "RIF / Identificación" },
  { key: "description", label: "Concepto del cobro" },
  { key: "totalAmount", label: "Monto total" },
];

export default function ConfigData({ data, onChange }: ConfigDataProps) {
  const handleChange = (field: ConfigDataProps["onChange"] extends (field: infer Key, value: string) => void ? Key : never) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field as keyof Pick<Data, "companyName" | "companyRif" | "description" | "totalAmount">, event.target.value);
    };

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h2 className="text-base font-medium text-gray-200">Datos del cobrador</h2>
        <p className="mt-1 text-xs text-gray-400">Edita la información que aparece en el checkout.</p>
      </div>

      <div className="flex flex-col gap-3">
        {fields.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-1 text-gray-300">
            {label}
            <input
              type="text"
              value={data[key]}
              onChange={handleChange(key)}
              className="w-full rounded-lg border border-gray-700 bg-[#1A0F17] px-3 py-2 text-gray-200 outline-none transition-colors placeholder:text-gray-500 focus:border-[#AE7AA9]"
            />
          </label>
        ))}
      </div>
    </div>
  );
}