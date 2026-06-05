import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { PartnersSectionData } from "@/types/partner";

export const getPartners = async (): Promise<PartnersSectionData | null> => {
  const docRef = doc(db, "partners", "team");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PartnersSectionData;
  }

  return null;
};