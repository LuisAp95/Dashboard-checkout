export interface Data {
  companyName: string;
  companyRif: string;
  description: string;
  totalAmount: string;
  banks: { label: string; value: string }[];
  documentTypes: string[];
}
