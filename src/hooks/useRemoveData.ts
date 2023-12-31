import { ref, remove } from "firebase/database";

import { database } from "../services/firebase";

async function useRemoveData(
  path: string,
  callback: (error: Error) => void
): Promise<void> {
  try {
    const dataRef = ref(database, path);

    if (!dataRef) {
      if (callback) return callback(new Error("Empty location reference"));
    }

    await remove(dataRef);
  } catch (err) {
    if (callback) return callback(err as Error);
  }
}

export { useRemoveData };
