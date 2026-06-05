export interface GalleryItem {
  id?: string;
  title: string;
  category: string;
  imageUrls: string[];
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface BeforeAfterGalleryItem {
  id?: string;
  title: string;
  category: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}