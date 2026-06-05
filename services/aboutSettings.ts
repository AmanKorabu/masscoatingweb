import { db } from "@/firebase/config";
import { AboutData } from "@/types/aboutData";
import { doc, getDoc } from "firebase/firestore";

export const getAboutSettings = async (): Promise<AboutData | null> => {
  const docRef = doc(db, "pagesContent", "about");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AboutData;
  }

  return null;
};