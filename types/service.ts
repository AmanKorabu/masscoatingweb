export interface ServiceData {
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  features: string[];
  extraServices?: string[];
  tag?: string;
  displayOrder: number;
  isActive: boolean;
}