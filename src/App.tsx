import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DevicePreviewType } from "./context/device-preview-context";
import { ViewConfig } from "./features/dashboard/presentacion/pages/ViewConfig";
import { TemplateFullView } from "./features/dashboard/presentacion/pages/TemplateFullView";
import { AppProvider } from "./context/AppContext";
import type { Data } from "./features/dashboard/dominio/interfaces/types";
import { TypographyProvider } from "./features/dashboard/context/useFontContext";

function App() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch("/form-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
      });
  }, []);

  if (!data) return null;

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
