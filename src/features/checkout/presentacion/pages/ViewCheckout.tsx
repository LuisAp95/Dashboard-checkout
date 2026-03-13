import React, { memo } from "react";
import { useAppContext } from "../../../../context/AppContext";
import type { Data } from "../../../dashboard/dominio/interfaces/types";
import { OneTemplate } from "../componentes/one-templete/OneTemplate";
import { TwoTemplate } from "../componentes/two-template/TwoTemplate";

// Memorizamos los templates para evitar re-renderizados innecesarios
const MemoizedOneTemplate = memo(OneTemplate);
const MemoizedTwoTemplate = memo(TwoTemplate);

export const ViewCheckout: React.FC<Data> = memo((props) => {
  // Solo extraer el estado que necesitamos
  const { selecteTemplate } = useAppContext().states;

  // No crear la función en cada renderizado
  if (selecteTemplate === "2") {
    return <MemoizedTwoTemplate {...props} />;
  }
  
  return <MemoizedOneTemplate {...props} />;
});