import type { DocumentFileType } from '../types'

const DB_NAME = 'ismart-elibrary-files'
const DB_VERSION = 1
const STORE = 'files'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error ?? new Error('Failed to open file storage'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
  })
}

export async function saveDocumentFile(documentId: string, file: File | Blob): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Failed to save file'))
    tx.objectStore(STORE).put(file, documentId)
  })
  db.close()
}

export async function getDocumentFile(documentId: string): Promise<Blob | null> {
  const db = await openDb()
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const request = tx.objectStore(STORE).get(documentId)
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null)
    request.onerror = () => reject(request.error ?? new Error('Failed to read file'))
  })
  db.close()
  return blob
}

export async function deleteDocumentFile(documentId: string): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Failed to delete file'))
    tx.objectStore(STORE).delete(documentId)
  })
  db.close()
}

export function getFileTypeFromName(name: string): DocumentFileType {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  return 'sample'
}

export function resolveDocumentFileType(
  filePath: string,
  fileType?: DocumentFileType,
): DocumentFileType {
  if (fileType) return fileType
  return getFileTypeFromName(filePath)
}
