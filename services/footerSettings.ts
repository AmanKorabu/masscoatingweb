import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { FooterData } from "@/types/footer";

export const getFooterSettings = async (): Promise<FooterData | null> => {
  const docRef = doc(db, "settings", "footer");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as FooterData;
  }

  return null;
};