import { Timestamp } from "firebase/firestore";

export interface GetQuoteSettingsData {
  badge: string;
  title: string;
  subTitle: string;

  formTitle: string;
  formSubTitle: string;

  serviceOptions: string[];
  materialOptions: string[];
  surfaceConditionOptions: string[];

  whatsappNumber: string;
  whatsappButtonText: string;

  processTitle: string;
  processSubTitle: string;
  processSteps: string[];

  ctaTitle: string;
  ctaSubTitle: string;
}

export interface QuoteRequestData {
  id?: string;

  name: string;
  companyName?: string;
  phone: string;
  email: string;

  service: string;
  materialType?: string;
  quantity?: string;
  dimensions?: string;
  surfaceCondition?: string;
  expectedDate?: string;
  pickupRequired?: string;

  message?: string;
  imageUrls: string[];

  status: "new" | "read" | "closed";
  createdAt?: Timestamp;
}