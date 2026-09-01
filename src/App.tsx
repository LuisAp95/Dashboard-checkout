import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DevicePreviewType } from "./context/device-preview-context";
import { ViewConfig } from "./features/dashboard/presentacion/pages/ViewConfig";
import { TemplateFullView } from "./features/dashboard/presentacion/pages/TemplateFullView";
import { AppProvider } from "./context/AppContext";
import type { Data } from "./features/dashboard/dominio/interfaces/types";
import { TypographyProvider } from "./features/dashboard/context/useFontContext";
import SypagoLoader from "./features/dashboard/presentacion/componentes/uploadImage/SypagoLoader";


function App() {
  const [data, setData] = useState<Data | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        const [response] = await Promise.all([
          fetch("http://localhost:8080/api/form-data"),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);

        if (!response.ok) {
          throw new Error("No se pudieron cargar los datos");
        }

        const json = await response.json();

        if (active) {
          setData(json);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        if (active) {
          setIsBooting(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  if (isBooting || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f12]">
        <SypagoLoader width={120} height={120} strokeColor="#AE7AA9" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <DevicePreviewType>
        <AppProvider>
          <TypographyProvider>
            <Routes>
              <Route path="/" element={<ViewConfig data={data} />} />
              <Route path="/template-view" element={<TemplateFullView data={data} />} />
            </Routes>
          </TypographyProvider>
        </AppProvider>
      </DevicePreviewType>
    </BrowserRouter>
  );
}

export default App;
