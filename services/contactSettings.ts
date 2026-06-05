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
  ContactMessageData,
  ContactSettingsData,
} from "@/types/contact";

const contactDocRef = doc(db, "settings", "contact");
const contactMessagesCollection = collection(db, "contactMessages");

const getSafeEmailId = (email: string) => {
  return email.trim().toLowerCase().replace(/[.#$/[\]]/g, "_");
};

export const getContactSettings =
  async (): Promise<ContactSettingsData | null> => {
    const snapshot = await getDoc(contactDocRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as ContactSettingsData;
  };

export const saveContactSettings = async (data: ContactSettingsData) => {
  return await setDoc(contactDocRef, data);
};

export const saveContactMessage = async (
  data: Omit<ContactMessageData, "id" | "createdAt" | "status">
) => {
  const email = data.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Email is required");
  }

  const safeEmailId = getSafeEmailId(email);

  // Check if this email already has an unread/new inquiry
  const emailLockRef = doc(db, "contactEmailLocks", safeEmailId);
  const emailLockSnap = await getDoc(emailLockRef);

  if (emailLockSnap.exists()) {
    throw new Error(
      "You have already submitted an inquiry. Please wait until our team reads your previous inquiry."
    );
  }

  // Save message as NEW
  const messageRef = await addDoc(contactMessagesCollection, {
    ...data,
    email,
    status: "new",
    createdAt: serverTimestamp(),
  });

  // Lock this email until admin marks message as READ
  await setDoc(emailLockRef, {
    email,
    messageId: messageRef.id,
    status: "blocked",
    createdAt: serverTimestamp(),
  });

  return messageRef;
};

export const getContactMessages = async (): Promise<ContactMessageData[]> => {
  const q = query(contactMessagesCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as ContactMessageData[];
};

export const updateContactMessageStatus = async (
  id: string,
  status: "new" | "read" | "closed"
) => {
  const messageRef = doc(db, "contactMessages", id);
  const messageSnap = await getDoc(messageRef);

  if (!messageSnap.exists()) {
    throw new Error("Message not found");
  }

  const messageData = messageSnap.data() as ContactMessageData;

  await updateDoc(messageRef, {
    status,
  });

  // If admin marks as READ, unlock the email
  if (status === "read" && messageData.email) {
    const safeEmailId = getSafeEmailId(messageData.email);
    const emailLockRef = doc(db, "contactEmailLocks", safeEmailId);

    await deleteDoc(emailLockRef);
  }
};