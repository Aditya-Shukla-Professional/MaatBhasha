// offlineDb.js - IndexedDB storage engine for PALASH MTB-MLE offline operation
// Optimized for low-cost Android tablets (>=2GB RAM, Android 9+)

const DB_NAME    = 'PalashMtbMleDB';
const DB_VERSION = 2;  // v2: added translationsCache store

let dbInstance = null;

export function openOfflineDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. FLN Curriculum Packs Store
      if (!db.objectStoreNames.contains('flnPacks')) {
        const packStore = db.createObjectStore('flnPacks', { keyPath: 'id' });
        packStore.createIndex('gradeLevel', 'gradeLevel', { unique: false });
        packStore.createIndex('competencyCode', 'competencyCode', { unique: false });
      }

      // 2. Custom Teacher Lessons Store
      if (!db.objectStoreNames.contains('customLessons')) {
        const lessonStore = db.createObjectStore('customLessons', { keyPath: 'id', autoIncrement: true });
        lessonStore.createIndex('createdAt', 'createdAt', { unique: false });
        lessonStore.createIndex('targetLang', 'targetLang', { unique: false });
      }

      // 3. Worksheets Store
      if (!db.objectStoreNames.contains('worksheets')) {
        const wsStore = db.createObjectStore('worksheets', { keyPath: 'id', autoIncrement: true });
        wsStore.createIndex('topic', 'topic', { unique: false });
      }

      // 4. Cached Audio Blobs Store
      if (!db.objectStoreNames.contains('audioCache')) {
        db.createObjectStore('audioCache', { keyPath: 'cacheKey' });
      }

      // 5. App Sync Metadata Store
      if (!db.objectStoreNames.contains('syncMeta')) {
        db.createObjectStore('syncMeta', { keyPath: 'key' });
      }

      // 6. Translation Cache Store (v2) — cached hi↔sat translations for offline reuse
      if (!db.objectStoreNames.contains('translationsCache')) {
        const txStore = db.createObjectStore('translationsCache', { keyPath: 'cacheKey' });
        txStore.createIndex('sourceLang', 'sourceLang', { unique: false });
        txStore.createIndex('cachedAt',   'cachedAt',   { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('[OfflineDB Error]', event.target.error);
      reject(event.target.error);
    };
  });
}

// ── CRUD Helpers ─────────────────────────────────────────────────────────────

export async function saveToStore(storeName, item) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllFromStore(storeName) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getByKey(storeName, key) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFromStore(storeName, key) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// ── Audio Caching ─────────────────────────────────────────────────────────────

export async function cacheAudio(text, langCode, audioDataUri) {
  const cacheKey = `${langCode}_${text.trim().toLowerCase().slice(0, 100)}`;
  return saveToStore('audioCache', {
    cacheKey,
    text,
    langCode,
    audioDataUri,
    cachedAt: new Date().toISOString()
  });
}

export async function getCachedAudio(text, langCode) {
  const cacheKey = `${langCode}_${text.trim().toLowerCase().slice(0, 100)}`;
  const record = await getByKey('audioCache', cacheKey);
  return record ? record.audioDataUri : null;
}

// ── Sync Manager Status ───────────────────────────────────────────────────────

export async function getStorageStats() {
  const db = await openOfflineDB();
  const stores = ['flnPacks', 'customLessons', 'worksheets', 'audioCache'];
  const stats = {};

  for (const storeName of stores) {
    const items = await getAllFromStore(storeName);
    stats[storeName] = items.length;
  }

  // Estimate storage usage
  let estimateMb = '0.0';
  if (navigator.storage && navigator.storage.estimate) {
    const { usage } = await navigator.storage.estimate();
    estimateMb = (usage / (1024 * 1024)).toFixed(1);
  }

  const lastSyncMeta = await getByKey('syncMeta', 'lastSyncTimestamp');

  return {
    ...stats,
    storageUsageMb: estimateMb,
    lastSync: lastSyncMeta?.timestamp || 'Never'
  };
}

export async function recordSyncTimestamp() {
  return saveToStore('syncMeta', {
    key: 'lastSyncTimestamp',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
}

// ── Translation Cache (hi-IN ↔ sat-IN) ───────────────────────────────────────
// Stores successful Sarvam API translation results for offline reuse.
// Never stores fake or error text — only verified API responses.

function makeTranslationCacheKey(text, sourceLang, targetLang) {
  const t = text.trim().toLowerCase().slice(0, 200);
  return `${sourceLang}→${targetLang}_${t}`;
}

/**
 * Cache a successful translation from Sarvam API.
 */
export async function cacheTranslation(text, sourceLang, targetLang, translated) {
  const cacheKey = makeTranslationCacheKey(text, sourceLang, targetLang);
  return saveToStore('translationsCache', {
    cacheKey,
    text:       text.trim(),
    sourceLang,
    targetLang,
    translated,
    cachedAt:   new Date().toISOString(),
  });
}

/**
 * Retrieve a cached translation. Returns null if not cached.
 */
export async function getCachedTranslation(text, sourceLang, targetLang) {
  const cacheKey = makeTranslationCacheKey(text, sourceLang, targetLang);
  const record   = await getByKey('translationsCache', cacheKey);
  return record ? record.translated : null;
}

/**
 * Get count of cached translations.
 */
export async function getCachedTranslationCount() {
  const items = await getAllFromStore('translationsCache');
  return items.length;
}
