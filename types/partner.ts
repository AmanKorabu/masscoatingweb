export interface PartnerData {
  name: string;
  position: string;
  education: string;
  location: string;
  imageUrl: string;
  bio: string;
  displayOrder: number;
  isActive: boolean;
}

export interface PartnersSectionData {
  badge?: string;
  title?: string;
  subTitle?: string;
  members: PartnerData[];
}