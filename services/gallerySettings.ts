import { db } from "@/firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  GalleryItem,
  BeforeAfterGalleryItem,
} from "@/types/gallery";

const galleryCollection = collection(db, "gallery");
const beforeAfterCollection = collection(db, "beforeAfterGallery");

/* Normal Gallery */
export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const q = query(galleryCollection, orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as GalleryItem[];
};

export const saveGalleryItem = async (id: string, data: GalleryItem) => {
  const docRef = doc(db, "gallery", id);
  return await setDoc(docRef, data);
};

export const deleteGalleryItem = async (id: string) => {
  const docRef = doc(db, "gallery", id);
  return await deleteDoc(docRef);
};

/* Before / After Gallery */
export const getBeforeAfterItems = async (): Promise<
  BeforeAfterGalleryItem[]
> => {
  const q = query(beforeAfterCollection, orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as BeforeAfterGalleryItem[];
};

export const saveBeforeAfterItem = async (
  id: string,
  data: BeforeAfterGalleryItem
) => {
  const docRef = doc(db, "beforeAfterGallery", id);
  return await setDoc(docRef, data);
};

export const deleteBeforeAfterItem = async (id: string) => {
  const docRef = doc(db, "beforeAfterGallery", id);
  return await deleteDoc(docRef);
};