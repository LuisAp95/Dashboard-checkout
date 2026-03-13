export interface OnePasosProps {
  name: string;
  rif: string;
  concept: string;
  total: string;
  onNext: () => void;
}

export interface PasosProps {
  name: string;
  rif: string;
  concept: string;
  total: string;
  onNext: () => void;
  onBack: () => void;
}

export interface FormProps {
  banks: { label: string; value: string }[];
  cl: string[];
  onNext: () => void;
  onBack: () => void;
}

export interface InterFormulario {
  banco: string;
  cuenta: string;
  phone: string;
  cl: string;
}