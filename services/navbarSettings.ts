import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { NavbarData } from "@/types/navbar";

export const getNavbarSettings = async (): Promise<NavbarData | null> => {
  try {
    const docRef = doc(db, "settings", "navbar");

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as NavbarData;
    }

    return null;
  } catch (error) {
    console.log("Navbar Fetch Error:", error);

    return null;
  }
};