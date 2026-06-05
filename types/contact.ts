import { Timestamp } from "firebase/firestore";
export interface ContactSettingsData {
  badge: string;
  title: string;
  subTitle: string;

  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;

  mapEmbedUrl: string;

  callButtonText: string;
  whatsappButtonText: string;
  formTitle: string;
  formSubTitle: string;
  serviceOptions: string[];
  ctaTitle: string;
  ctaSubTitle: string;
}

export interface ContactMessageData {
   id?: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  status: "new" | "read" | "closed";
  createdAt?: Timestamp;
}