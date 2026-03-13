import WavesBackground from "./waves/WavesBackground";
import { useAppContext } from "../../../context/AppContext";
import fondo from "../../../assets/bg-bancrecer.jpeg";

const FondoSvg = () => {
  const { states } = useAppContext();
  console.log("states", states);

  const { fondoTemplate1, selectedTemplateName } = states;

  // Función para obtener colores según el template
  const getColorsByTemplate = (templateName: string) => {
    switch (templateName) {
      case "0168":
        return {
          cls1: "#302560", // tono muy oscuro
          cls2: "#6755b6", // Gris azulado oscuro
          cls3: "#49358a", // Azul medio 49358a medio
          cls4: "#6755b6", // tono muy claro el final
          cls5: "#302560", // Azul
          cls6: "#6755b6", // Azul muy claro
        };
      case "0172":
        return {
          cls1: "#001f3d", // Gris o
          cls2: "#004987", // Gris medio
          cls3: "#002f5e", // Gris
          cls4: "#004987", // Gris claro
          cls5: "#001f3d", // Gris muy claro
          cls6: "#004987", // Gris casi blanco
        };
      case "0114":
        return {
          cls1: "#00284d", // Marrón oscuro
          cls2: "#00bbbc", // Marrón medio
          cls3: "#005578", // Dorado
          cls4: "#00bbbc", // Amarillo dorado
          cls5: "#00283d", // Amarillo claro
          cls6: "#00bbbc", // Amarillo muy claro
        };
      default:
        // Colores por defecto
        return {
          cls1: "#003c9a",
          cls2: "#0043a7",
          cls3: "#0043a7",
          cls4: "#00bfff",
          cls5: "#003c9a",
          cls6: "#0043a7",
        };
    }
  };
  /*
   cls1: "#003c9a",
            cls2: "#0043a7",
            cls3: "#0043a7",
            cls4: "#00bfff",
            cls5: "#003c9a",
            cls6: "#0043a7",*/
  const templateColors = getColorsByTemplate(selectedTemplateName);

  return (
    <>
      {fondoTemplate1 ? (
        <div className="hidden absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full md:block">
          <img
            src={fondoTemplate1}
            alt="Fondo"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <>
          {selectedTemplateName === "0168" ? (
            <div className="hidden absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full md:block">
              <img
                src={fondo}
                alt="Fondo"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="hidden md:block">
              <WavesBackground
                fullSize={true}
                position="absolute"
                zIndex={-1}
                colors={templateColors}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FondoSvg;
{
  /*

<>
      {fondoTemplate1 ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full  md:block">
          <img
            src={fondoTemplate1}
            alt="Fondo"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <>
          {selectedTemplateName === "0168" ? (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full  md:block">
              <img
                src={fondo}
                alt="Fondo"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <WavesBackground
              fullSize={true}
              position="absolute"
              zIndex={-1}
              colors={templateColors}
            />
          )}
        </>
      )}
    </>*/
}
