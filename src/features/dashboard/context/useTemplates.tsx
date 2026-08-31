import { useState, useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useTypography, type FontType } from "./useFontContext";

interface Template {
  templateName: string;
  selecteTemplate?: string;
  [key: string]: string | boolean | null | undefined;
}

const STORAGE_KEY = "saved_templates";
const TEMPLATES_API_URL = "http://localhost:8080/api/templates";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { actions } = useAppContext();
  const { setFont } = useTypography();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch(TEMPLATES_API_URL);
        if (!response.ok) throw new Error("No se pudieron cargar los templates");
        const data = await response.json();
        if (data.templates && Array.isArray(data.templates)) {
          setTemplates(data.templates);
          // Actualizar localStorage con los datos del archivo
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          // Si el archivo no tiene la estructura correcta, intentar desde localStorage
          const savedTemplates = localStorage.getItem(STORAGE_KEY);
          if (savedTemplates) {
            try {
              const parsed = JSON.parse(savedTemplates);
              if (parsed.templates && Array.isArray(parsed.templates)) {
                setTemplates(parsed.templates);
              }
            } catch (e) {
              console.warn(
                "Error parsing saved templates from localStorage:",
                e
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "Error loading templates from file, trying localStorage:",
          error
        );
        // Si falla la carga del archivo, intentar desde localStorage como respaldo
        const savedTemplates = localStorage.getItem(STORAGE_KEY);
        if (savedTemplates) {
          try {
            const parsed = JSON.parse(savedTemplates);
            if (parsed.templates && Array.isArray(parsed.templates)) {
              setTemplates(parsed.templates);
            }
          } catch (e) {
            console.warn("Error parsing saved templates from localStorage:", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const applyTemplate = (template: Template) => {
    if (template.selecteTemplate === "new") {
      // Si es crear nuevo template, establecer los valores por defecto
      actions.setSelectedTemplateName("");
      actions.setSelecteTemplate("1");
      actions.setHasActiveTemplate(false);
      // Restablecer todos los valores a los predeterminados
      actions.setIsBgcolor("#0B416E");
      actions.setIsBgFormulariocolor("#fdfefe");
      actions.setIsPosition(false);
      actions.setBgColorPago("#FFFFFF");
      actions.setTextColorPago("#0B416E");
      actions.setbgButtonColorForm("#0065BB");
      actions.setTextColorInfo("#FFFFFF");
      actions.setTextColorform("#020202");
      actions.setTextColorBotonForm("#FFFFFF");
      actions.setSelecteImputT("1");
      actions.setBgModalColor("#ffffff");
      actions.setTextColorModal("#0B416E");
      actions.setTextModalColorInfo("#666666");
      actions.setSelecBgImage(null);
      actions.setSelecLogo(null);
      actions.setLabelBanco("Banco");
      actions.setLabelPhone("Teléfono");
      actions.setLabelCuenta("Número de Cuenta");
      actions.setLabelCedula("Número de Documento");
      actions.setInputHoverColor("#0065BB");
      actions.setTextColorPaneIqz("#000000");
      actions.setFondoTemplate1(null);
      setFont("ibmPlex");
      return;
    }

    // Guardar el nombre del template y marcar como template activo
    actions.setSelectedTemplateName(template.templateName);
    actions.setSelecteTemplate(template.selecteTemplate || "1");
    actions.setHasActiveTemplate(true);

    // Aplicar cada propiedad del template a los estados correspondientes
    Object.entries(template).forEach(([key, value]) => {
      if (key === "templateName" || key === "selecteTemplate") return; // Ignorar estos campos
      if (key === "font" && typeof value === "string") {
        setFont(value as FontType);
        return;
      }

      // Mapeo especial para propiedades que tienen nombres de setters diferentes
      const specialMappings: { [key: string]: keyof typeof actions } = {
        bgButtonColorForm: "setbgButtonColorForm",
        inputHoverColor: "setInputHoverColor",
        textColorPaneIqz: "setTextColorPaneIqz",
        selectImputT: "setSelecteImputT",
        fondoTemplate1: "setFondoTemplate1",
      };

      const actionKey =
        specialMappings[key] ||
        (`set${key.charAt(0).toUpperCase()}${key.slice(
          1
        )}` as keyof typeof actions);
      if (
        actionKey in actions &&
        typeof actions[actionKey] === "function" &&
        value !== undefined
      ) {
        (actions[actionKey] as (value: string | boolean | null) => void)(value);
      }
    });
  };

  const saveTemplate = async (templateData: Template) => {
    const response = await fetch(TEMPLATES_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(templateData),
    });

    if (!response.ok) {
      throw new Error(await response.text() || "No se pudo guardar el template");
    }

    const savedTemplate = (await response.json()) as Template;
    const newTemplates = [...templates, savedTemplate];
    setTemplates(newTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: newTemplates }));
    return newTemplates;
  };

  const updateTemplate = async (
    templateName: string,
    templateData: Partial<Template>
  ) => {
    const response = await fetch(TEMPLATES_API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateName, data: templateData }),
    });

    if (!response.ok) {
      throw new Error(await response.text() || "No se pudo actualizar el template");
    }

    const result = (await response.json()) as { templates: Template[] };
    setTemplates(result.templates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return result.templates;
  };

  return {
    templates,
    isLoading,
    applyTemplate,
    saveTemplate,
    updateTemplate,
  };
};
