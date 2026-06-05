import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FooterData } from "@/types/footer";

const footerDocRef = doc(db, "settings", "footer");

export const getFooterSettings = async (): Promise<FooterData | null> => {
  const docSnap = await getDoc(footerDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as FooterData;
  }

  return null;
};

export const saveFooterSettings = async (data: FooterData) => {
  return await setDoc(footerDocRef, data, { merge: true });
};