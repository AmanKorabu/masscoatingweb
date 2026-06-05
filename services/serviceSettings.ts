import { db } from "@/firebase/config";
import { ServiceData } from "@/types/service";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

const servicesCollection = collection(db, "services");

export const getServices = async (): Promise<ServiceData[]> => {
  const q = query(servicesCollection, orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as ServiceData[];
};

export const saveService = async (id: string, data: ServiceData) => {
  const docRef = doc(db, "services", id);
  return await setDoc(docRef, data);
};

export const deleteService = async (id: string) => {
  const docRef = doc(db, "services", id);
  return await deleteDoc(docRef);
};