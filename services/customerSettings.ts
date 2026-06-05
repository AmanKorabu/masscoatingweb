import { db } from "@/firebase/config";
import { CustomersData } from "@/types/customer";
import { doc, getDoc } from "firebase/firestore";


export const getCustomersSettings = async (): Promise<CustomersData | null> => {
  const docRef = doc(db, "homepage", "customers");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as CustomersData;
  }

  return null;
};