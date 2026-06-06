export interface ServiceData {
  id?: string;

  // Main service content
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  features: string[];
  extraServices?: string[];
  tag?: string;
  displayOrder: number;
  isActive: boolean;

  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}