// src/utils/validators.ts
export const isRequired = (value: string): string | null => {
    return value.trim() === '' ? 'Este campo es requerido' : null;
  };
  
  export const isOnlyNumbers = (value: string): string | null => {
    return /^\d+$/.test(value) ? null : 'Solo se permiten números';
  };
  
  export const isValidPhoneVE = (value: string): string | null => {
    // Formato: 04XX-XXXXXXX (ej: 0412-1234567) o solo números 04121234567
    const regex = /^(?:(?:0)?4)(12|14|16|24|26)\d{7}$/;
    return regex.test(value) ? null : 'Teléfono inválido (ej: 04121234567)';
  };
  export const isValidAccountVE = (value: string): string | null => {
    // 20 dígitos bancarios
    const regex = /^\d{20}$/;
    return regex.test(value) ? null : 'Cuenta bancaria inválida (20 dígitos)';
  };
  export const validateBankCodeMatch = (cuenta: string, bancoCodigo: string): string | null => {
    if (!cuenta || cuenta.length < 4) return null;
    return cuenta.startsWith(bancoCodigo)
      ? null
      : `El número de cuenta debe comenzar con el código del banco: ${bancoCodigo}`;
  };
