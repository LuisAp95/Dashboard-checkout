import type { FontType } from '../../context/useFontContext';

export interface ConfigurationData {
  // AppContext states
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
  
  // FontContext states
  font: FontType;
} 