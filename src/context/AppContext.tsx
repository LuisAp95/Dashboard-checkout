import React, { createContext, useState, useContext, useMemo } from "react";
import type { ReactNode } from "react";

type AppContextType = {
  states: {
    isBgcolor: string;
    isBgFormulariocolor: string;
    isPosition: boolean;
    bgColorPago: string;
    textColorPago: string;
    bgButtonColorForm: string;
    textColorInfo: string;
    textColorform: string;
    textColorBotonForm: string;
    selecteTemplate: string;
    selectImputT: string;
    bgModalColor: string;
    textColorModal: string;
    textModalColorInfo: string;
    textColorConInfo: string;
    selecBgImage: string | null;
    selecLogo: string | null;
    labelBanco: string;
    labelPhone: string;
    labelCuenta: string;
    labelCedula: string;
    isOpenModal: boolean;
    selectedTemplateName: string;
    hasActiveTemplate: boolean;
    inputHoverColor: string;
    textColorPaneIqz: string;
    fondoTemplate1: string | null;
  };
  actions: {
    setIsBgcolor: React.Dispatch<React.SetStateAction<string>>;
    setIsBgFormulariocolor: React.Dispatch<React.SetStateAction<string>>;
    setIsPosition: React.Dispatch<React.SetStateAction<boolean>>;
    setbgButtonColorForm: React.Dispatch<React.SetStateAction<string>>;
    setBgColorPago: React.Dispatch<React.SetStateAction<string>>;
    setTextColorPago: React.Dispatch<React.SetStateAction<string>>;
    setTextColorInfo: React.Dispatch<React.SetStateAction<string>>;
    setTextColorform: React.Dispatch<React.SetStateAction<string>>;
    setTextColorBotonForm: React.Dispatch<React.SetStateAction<string>>;
    setSelecteTemplate: React.Dispatch<React.SetStateAction<string>>;
    setSelecteImputT: React.Dispatch<React.SetStateAction<string>>;
    setBgModalColor: React.Dispatch<React.SetStateAction<string>>;
    setTextColorModal: React.Dispatch<React.SetStateAction<string>>;
    setTextModalColorInfo: React.Dispatch<React.SetStateAction<string>>;
    setTextColorConInfo: React.Dispatch<React.SetStateAction<string>>;
    setSelecBgImage: React.Dispatch<React.SetStateAction<string | null>>;
    setSelecLogo: React.Dispatch<React.SetStateAction<string | null>>;
    setLabelBanco: React.Dispatch<React.SetStateAction<string>>;
    setLabelPhone: React.Dispatch<React.SetStateAction<string>>;
    setLabelCuenta: React.Dispatch<React.SetStateAction<string>>;
    setLabelCedula: React.Dispatch<React.SetStateAction<string>>;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedTemplateName: React.Dispatch<React.SetStateAction<string>>;
    setHasActiveTemplate: React.Dispatch<React.SetStateAction<boolean>>;
    setInputHoverColor: React.Dispatch<React.SetStateAction<string>>;
    setTextColorPaneIqz: React.Dispatch<React.SetStateAction<string>>;
    setFondoTemplate1: React.Dispatch<React.SetStateAction<string | null>>;
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isBgcolor, setIsBgcolor] = useState<string>("#0B416E"); //// Color Fondo Detalles del Pagador
  const [isBgFormulariocolor, setIsBgFormulariocolor] =
    useState<string>("#F5F5F5"); /// Color Fondo del Formulario
  const [isPosition, setIsPosition] = useState<boolean>(false); //// Cambiar de Posicion el template 1 izq Drc
  const [bgColorPago, setBgColorPago] = useState<string>("#FFFFFF"); ////// Color del Boton de regresar si esta activo
  const [textColorPago, setTextColorPago] = useState<string>("#0B416E"); ///// Color del texto del boton de regresar
  const [bgButtonColorForm, setbgButtonColorForm] = useState<string>("#0065BB"); ///// color fondo de los botones del formulario
  const [textColorInfo, setTextColorInfo] = useState<string>("#FFFFFF"); ///color del texto la informacion del pagador
  const [textColorform, setTextColorform] = useState<string>("#020202"); ///Color del texto del formulario
  const [textColorBotonForm, setTextColorBotonForm] =
    useState<string>("#FFFFFF"); ///color del texto de los botones del formulario
  const [selecteTemplate, setSelecteTemplate] = useState<string>("1"); ///Templete que se debe renderizar
  const [selectImputT, setSelecteImputT] = useState<string>("1"); ////Selecciona el tipo de input que se va renderizar
  const [bgModalColor, setBgModalColor] = useState<string>("#ffffff"); ///// Color Fondo Modales
  const [textColorModal, setTextColorModal] = useState<string>("#000000"); ////color texto Modal
  const [textModalColorInfo, setTextModalColorInfo] =
    useState<string>("#0B416E");
  const [textColorConInfo, setTextColorConInfo] = useState<string>("#666666");
  const [selecBgImage, setSelecBgImage] = useState<string | null>(null); ////Valida si hay una imagen de fondo
  const [selecLogo, setSelecLogo] = useState<string | null>(null); ////Valida si hay una imagen de fondo
  const [labelBanco, setLabelBanco] = useState<string>("Banco");
  const [labelPhone, setLabelPhone] = useState<string>("Teléfono");
  const [labelCuenta, setLabelCuenta] = useState<string>("Número de Cuenta");
  const [labelCedula, setLabelCedula] = useState<string>("Número de Documento");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");
  const [hasActiveTemplate, setHasActiveTemplate] = useState<boolean>(false);
  const [inputHoverColor, setInputHoverColor] = useState<string>("#0065BB"); // Color por defecto para el hover de los inputs
  const [textColorPaneIqz, setTextColorPaneIqz] = useState<string>("#000000");
  const [fondoTemplate1, setFondoTemplate1] = useState<string | null>(null); // URL de imagen para fondo del template 1

  const value = useMemo<AppContextType>(
    () => ({
      states: {
        isBgcolor,
        isBgFormulariocolor,
        isPosition,
        bgColorPago,
        textColorPago,
        bgButtonColorForm,
        textColorInfo,
        textColorform,
        textColorBotonForm,
        selecteTemplate,
        selecBgImage,
        selectImputT,
        bgModalColor,
        textColorModal,
        textModalColorInfo,
        textColorConInfo,
        selecLogo,
        labelBanco,
        labelPhone,
        labelCuenta,
        labelCedula,
        isOpenModal,
        selectedTemplateName,
        hasActiveTemplate,
        inputHoverColor,
        textColorPaneIqz,
        fondoTemplate1,
      },
      actions: {
        setIsBgcolor,
        setIsBgFormulariocolor,
        setIsPosition,
        setbgButtonColorForm,
        setBgColorPago,
        setTextColorPago,
        setTextColorInfo,
        setTextColorform,
        setTextColorBotonForm,
        setSelecteTemplate,
        setSelecteImputT,
        setBgModalColor,
        setTextColorModal,
        setTextModalColorInfo,
        setTextColorConInfo,
        setSelecBgImage,
        setSelecLogo,
        setLabelBanco,
        setLabelPhone,
        setLabelCuenta,
        setLabelCedula,
        setIsOpenModal,
        setSelectedTemplateName,
        setHasActiveTemplate,
        setInputHoverColor,
        setTextColorPaneIqz,
        setFondoTemplate1,
      },
    }),
    [
      isBgcolor,
      isBgFormulariocolor,
      isPosition,
      bgColorPago,
      textColorPago,
      bgButtonColorForm,
      textColorInfo,
      textColorform,
      textColorBotonForm,
      selecteTemplate,
      selectImputT,
      bgModalColor,
      textColorModal,
      textModalColorInfo,
      textColorConInfo,
      selecBgImage,
      selecLogo,
      labelBanco,
      labelPhone,
      labelCuenta,
      labelCedula,
      isOpenModal,
      selectedTemplateName,
      hasActiveTemplate,
      inputHoverColor,
      textColorPaneIqz,
      fondoTemplate1,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
