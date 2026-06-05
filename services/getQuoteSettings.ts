import { db } from "@/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  GetQuoteSettingsData,
  QuoteRequestData,
} from "@/types/getQuote";

const getQuoteDocRef = doc(db, "settings", "getQuote");
const quoteRequestsCollection = collection(db, "quoteRequests");

const getSafeEmailId = (email: string) => {
  return email.trim().toLowerCase().replace(/[.#$/[\]]/g, "_");
};

export const getGetQuoteSettings =
  async (): Promise<GetQuoteSettingsData | null> => {
    const snapshot = await getDoc(getQuoteDocRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as GetQuoteSettingsData;
  };

export const saveGetQuoteSettings = async (data: GetQuoteSettingsData) => {
  return await setDoc(getQuoteDocRef, data);
};

export const saveQuoteRequest = async (
  data: Omit<QuoteRequestData, "id" | "createdAt" | "status">
) => {
  const email = data.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Email is required");
  }

  const safeEmailId = getSafeEmailId(email);

  const emailLockRef = doc(db, "quoteEmailLocks", safeEmailId);
  const emailLockSnap = await getDoc(emailLockRef);

  if (emailLockSnap.exists()) {
    throw new Error(
      "You have already submitted a quote request. Please wait until our team reads your previous request."
    );
  }

  const requestRef = await addDoc(quoteRequestsCollection, {
    ...data,
    email,
    status: "new",
    createdAt: serverTimestamp(),
  });

  await setDoc(emailLockRef, {
    email,
    quoteRequestId: requestRef.id,
    status: "blocked",
    createdAt: serverTimestamp(),
  });

  return requestRef;
};

export const getQuoteRequests = async (): Promise<QuoteRequestData[]> => {
  const q = query(quoteRequestsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as QuoteRequestData[];
};

export const updateQuoteRequestStatus = async (
  id: string,
  status: "new" | "read" | "closed"
) => {
  const requestRef = doc(db, "quoteRequests", id);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error("Quote request not found");
  }

  const requestData = requestSnap.data() as QuoteRequestData;

  await updateDoc(requestRef, {
    status,
  });

  if (status === "read" && requestData.email) {
    const safeEmailId = getSafeEmailId(requestData.email);
    const emailLockRef = doc(db, "quoteEmailLocks", safeEmailId);

    await deleteDoc(emailLockRef);
  }
};