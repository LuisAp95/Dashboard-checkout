import React, { useState } from "react";
import ConfigPanel from "../componentes/panel-configuracion/ConfigPanel";
import { MonitorPreview } from "../componentes/panel-monitor/MonitorPreview";
import type { Data } from "../../dominio/interfaces/types";
import { useAppContext } from "../../../../context/AppContext";

type Props = {
  data: Data;
};

export const ViewConfig: React.FC<Props> = ({ data }) => {
  const { actions, states } = useAppContext();
  const [checkoutData, setCheckoutData] = useState<Data>(data);

  const handleDataChange = (
    field: keyof Pick<Data, "companyName" | "companyRif" | "description" | "totalAmount">,
    value: string
  ) => {
    setCheckoutData((previous) => ({ ...previous, [field]: value }));
  };

  const handleLogoUpload = (imageUrl: string) => {
    actions.setSelecLogo(imageUrl);
  };

  const handleBackgroundUpload = (imageUrl: string) => {
    actions.setSelecBgImage(imageUrl);
  };

  const handleTemplate1BackgroundUpload = (imageUrl: string) => {
    actions.setFondoTemplate1(imageUrl);
  };

  const handleSaveConfig = () => {
    // Aquí se enviarían los datos al backend
    console.log(
      "Datos a enviar al backend:",
      states.selecBgImage,
      states.selecLogo
    );
    // Implementar la lógica para enviar al backend
  };
  return (
    <div className="flex flex-col h-screen relative">
      {/*<BubbleBackground />*/}
      {/*<Header /> #2D2437 */}
      <main className="flex h-screen flex-col bg-[#2B2529] md:flex-row flex-1 w-full p-4 gap-2 overflow-hidden">
        <ConfigPanel
          onLogoUpload={handleLogoUpload}
          onBackgroundUpload={handleBackgroundUpload}
          onTemplate1BackgroundUpload={handleTemplate1BackgroundUpload}
          onSave={handleSaveConfig}
          data={checkoutData}
          onDataChange={handleDataChange}
        />
        <MonitorPreview data={checkoutData} />
      </main>
    </div>
  );
};
