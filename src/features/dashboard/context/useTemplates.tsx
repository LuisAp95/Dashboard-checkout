import { useState, useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useTypography, type FontType } from "./useFontContext";

interface Template {
  templateName: string;
  selecteTemplate?: string;
  [key: string]: string | boolean | null | undefined;
}

const STORAGE_KEY = "saved_templates";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { actions } = useAppContext();
  const { setFont } = useTypography();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Siempre cargar desde el archivo público primero para obtener la versión más reciente
        const response = await fetch("/template.json");
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

  const saveTemplate = (templateData: Template) => {
    const newTemplates = [...templates, templateData];
    setTemplates(newTemplates);

    const dataToSave = { templates: newTemplates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      downloadTemplateJson(dataToSave);
      return newTemplates;
    } catch (e: any) {
      const isQuotaError = e && (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014);
      console.warn("localStorage setItem failed", e);
      if (!isQuotaError) throw e;

      // Fallbacks escalonados: 1) sanitizar sólo el nuevo template
      // 2) sanitizar todos los templates
      // 3) podar plantillas antiguas. Si todo falla, ofrecer descarga y alerta.

      const sanitizeTemplateFields = (t: Template) => {
        const { selecBgImage, selecLogo, fondoTemplate1, ...rest } = t as any;
        return { ...rest, selecBgImage: null, selecLogo: null, fondoTemplate1: null } as Template;
      };

      // 1) sanitizar sólo el nuevo
      const sanitizedTemplate = sanitizeTemplateFields(templateData);
      const sanitizedTemplates = [...templates, sanitizedTemplate];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: sanitizedTemplates }));
        downloadTemplateJson({ templates: sanitizedTemplates });
        setTemplates(sanitizedTemplates);
        return sanitizedTemplates;
      } catch (err) {
        console.warn("Saving sanitized (new) template failed", err);
      }

      // 2) sanitizar todos
      const allSanitized = newTemplates.map(sanitizeTemplateFields);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: allSanitized }));
        downloadTemplateJson({ templates: allSanitized });
        setTemplates(allSanitized);
        return allSanitized;
      } catch (err) {
        console.warn("Saving sanitized (all) templates failed", err);
      }

      // 3) podar a las últimas N plantillas
      const MAX_KEEP = 10;
      const pruned = allSanitized.slice(-MAX_KEEP);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: pruned }));
        downloadTemplateJson({ templates: pruned });
        setTemplates(pruned);
        return pruned;
      } catch (err) {
        console.warn("Saving pruned templates failed", err);
      }

      // Último recurso: descargar el JSON con los datos actuales y avisar al usuario
      try {
        downloadTemplateJson(dataToSave);
      } catch (err) {
        console.error("Failed to trigger download for templates", err);
      }
      alert(
        "No se pudo guardar en localStorage porque el espacio está lleno. Se ha descargado 'template.json' con la configuración actual. Reemplaza 'public/template.json' manualmente o limpia el almacenamiento del navegador."
      );

      return newTemplates;
    }
  };

  const updateTemplate = (
    templateName: string,
    templateData: Partial<Template>
  ) => {
    const updatedTemplates = templates.map((template) =>
      template.templateName === templateName
        ? { ...template, ...templateData }
        : template
    );

    setTemplates(updatedTemplates);

    // Guardar en localStorage
    const dataToSave = { templates: updatedTemplates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      downloadTemplateJson(dataToSave);
      return updatedTemplates;
    } catch (e: any) {
      const isQuotaError = e && (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014);
      console.warn("localStorage setItem failed", e);
      if (!isQuotaError) throw e;

      const sanitizeTemplateFields = (t: Template) => {
        const { selecBgImage, selecLogo, fondoTemplate1, ...rest } = t as any;
        return { ...rest, selecBgImage: null, selecLogo: null, fondoTemplate1: null } as Template;
      };

      // 1) sanitizar sólo el actualizado
      const sanitizedUpdated = updatedTemplates.map((t) =>
        t.templateName === templateName ? sanitizeTemplateFields(t) : t
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: sanitizedUpdated }));
        downloadTemplateJson({ templates: sanitizedUpdated });
        setTemplates(sanitizedUpdated);
        return sanitizedUpdated;
      } catch (err) {
        console.warn("Saving sanitized (updated) templates failed", err);
      }

      // 2) sanitizar todos
      const allSanitized = updatedTemplates.map(sanitizeTemplateFields);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: allSanitized }));
        downloadTemplateJson({ templates: allSanitized });
        setTemplates(allSanitized);
        return allSanitized;
      } catch (err) {
        console.warn("Saving sanitized (all) templates failed", err);
      }

      // 3) podar
      const MAX_KEEP = 10;
      const pruned = allSanitized.slice(-MAX_KEEP);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: pruned }));
        downloadTemplateJson({ templates: pruned });
        setTemplates(pruned);
        return pruned;
      } catch (err) {
        console.warn("Saving pruned templates failed", err);
      }

      // Descargar y avisar
      try {
        downloadTemplateJson(dataToSave);
      } catch (err) {
        console.error("Failed to trigger download for templates", err);
      }
      alert(
        "No se pudo actualizar en localStorage porque el espacio está lleno. Se ha descargado 'template.json' con la configuración actual. Reemplaza 'public/template.json' manualmente o limpia el almacenamiento del navegador."
      );

      return updatedTemplates;
    }
  };

  const downloadTemplateJson = (data: { templates: Template[] }) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    templates,
    isLoading,
    applyTemplate,
    saveTemplate,
    updateTemplate,
    downloadTemplateJson,
  };
};
