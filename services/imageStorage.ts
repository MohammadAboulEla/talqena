// IndexedDB service for storing images as Blobs
const DB_NAME = 'talqena_images';
const DB_VERSION = 1;
const STORE_NAME = 'images';

interface ImageDB {
    id: string;
    blob: Blob;
    timestamp: number;
}

class ImageStorageService {
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }

    async saveImage(id: string, blob: Blob): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const imageData: ImageDB = {
                id,
                blob,
                timestamp: Date.now()
            };

            const request = store.put(imageData);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getImage(id: string): Promise<Blob | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => {
                const result = request.result as ImageDB | undefined;
                resolve(result ? result.blob : null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteImage(id: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getAllImageIds(): Promise<string[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAllKeys();

            request.onsuccess = () => resolve(request.result as string[]);
            request.onerror = () => reject(request.error);
        });
    }

    async cleanupOrphanedImages(validIds: string[]): Promise<void> {
        const allIds = await this.getAllImageIds();
        const orphanedIds = allIds.filter(id => !validIds.includes(id));

        for (const id of orphanedIds) {
            await this.deleteImage(id);
        }
    }

    // Helper to convert File to Blob (already is a Blob, but for consistency)
    fileToBlob(file: File): Blob {
        return file;
    }

    // Helper to create Object URL from Blob
    createObjectURL(blob: Blob): string {
        return URL.createObjectURL(blob);
    }

    // Helper to revoke Object URL (important for memory management)
    revokeObjectURL(url: string): void {
        URL.revokeObjectURL(url);
    }
}

// Export singleton instance
export const imageStorage = new ImageStorageService();
