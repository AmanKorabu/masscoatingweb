import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { HeroData } from "@/types/hero";

export const getHeroSettings = async (): Promise<HeroData | null> => {
  const docRef = doc(db, "homepage", "hero");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as HeroData;
  }

  return null;
};