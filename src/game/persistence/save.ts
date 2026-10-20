import { parseCampaign, type Campaign } from "../campaign";
const DB = "basilis-campaign";
const STORE = "checkpoints";
export type LoadResult =
  | { status: "empty" }
  | { status: "loaded"; campaign: Campaign }
  | { status: "invalid" }
  | { status: "unavailable" };
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE))
        request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("blocked"));
  });
}
export async function loadCampaign(): Promise<LoadResult> {
  try {
    await writes;
    const db = await open();
    const raw = await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const r = tx.objectStore(STORE).get("main");
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    db.close();
    if (raw === undefined) return { status: "empty" };
    const c = parseCampaign(raw);
    return c ? { status: "loaded", campaign: c } : { status: "invalid" };
  } catch {
    return { status: "unavailable" };
  }
}
let writes: Promise<boolean> = Promise.resolve(true);
export function saveCampaign(campaign: Campaign): Promise<boolean> {
  const snapshot = structuredClone(campaign);
  writes = writes
    .catch(() => false)
    .then(async () => {
      if (!parseCampaign(snapshot)) return false;
      try {
        const db = await open();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).put(snapshot, "main");
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        });
        db.close();
        return true;
      } catch {
        return false;
      }
    });
  return writes;
}
