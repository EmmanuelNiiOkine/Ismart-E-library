import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  deleteDocumentFile,
} from '../utils/fileStorage'
import { categories as initialCategories, documents as initialDocuments } from '../data/mockData'
import { searchDocumentsRanked, type SearchFilters, type SearchResult } from '../utils/search'
import type { Category, Document } from '../types'

interface LibraryContextValue {
  categories: Category[]
  documents: Document[]
  getCategoryById: (id: string) => Category | undefined
  getDocumentById: (id: string) => Document | undefined
  getDocumentsByCategory: (categoryId: string) => Document[]
  getCategoryDocumentCount: (categoryId: string) => number
  search: (query: string, filters?: SearchFilters) => SearchResult[]
  createCategory: (input: { name: string; description: string }) => Category
  updateCategory: (id: string, input: { name: string; description: string }) => void
  deleteCategory: (id: string) => void
  addDocument: (input: Omit<Document, 'id'>) => Document
  updateDocument: (id: string, updates: Partial<Omit<Document, 'id'>>) => void
  deleteDocument: (id: string) => void
  moveDocumentToCategory: (id: string, categoryId: string) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [categoryList, setCategoryList] = useState(initialCategories)
  const [documentList, setDocumentList] = useState(initialDocuments)

  const getCategoryById = useCallback(
    (id: string) => categoryList.find((c) => c.id === id),
    [categoryList],
  )

  const getDocumentById = useCallback(
    (id: string) => documentList.find((d) => d.id === id),
    [documentList],
  )

  const getDocumentsByCategory = useCallback(
    (categoryId: string) => documentList.filter((d) => d.categoryId === categoryId),
    [documentList],
  )

  const getCategoryDocumentCount = useCallback(
    (categoryId: string) => documentList.filter((d) => d.categoryId === categoryId).length,
    [documentList],
  )

  const categories = useMemo(
    () =>
      categoryList.map((cat) => ({
        ...cat,
        documentCount: getCategoryDocumentCount(cat.id),
      })),
    [categoryList, getCategoryDocumentCount],
  )

  const search = useCallback(
    (query: string, filters: SearchFilters = {}) =>
      searchDocumentsRanked(documentList, query, filters, (id) =>
        getCategoryById(id)?.name,
      ),
    [documentList, getCategoryById],
  )

  const createCategory = useCallback((input: { name: string; description: string }) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: input.name,
      description: input.description,
      documentCount: 0,
      order: categoryList.length + 1,
    }
    setCategoryList((prev) => [...prev, newCat])
    return newCat
  }, [categoryList.length])

  const updateCategory = useCallback((id: string, input: { name: string; description: string }) => {
    setCategoryList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: input.name, description: input.description } : c)),
    )
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategoryList((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addDocument = useCallback((input: Omit<Document, 'id'>) => {
    const doc: Document = {
      ...input,
      id: `doc-${Date.now()}`,
      coverImageUrl: input.coverImageUrl ?? null,
    }
    setDocumentList((prev) => [doc, ...prev])
    return doc
  }, [])

  const updateDocument = useCallback((id: string, updates: Partial<Omit<Document, 'id'>>) => {
    setDocumentList((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
    )
  }, [])

  const deleteDocument = useCallback((id: string) => {
    setDocumentList((prev) => prev.filter((d) => d.id !== id))
    void deleteDocumentFile(id)
  }, [])

  const moveDocumentToCategory = useCallback((id: string, categoryId: string) => {
    setDocumentList((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, categoryId } : doc)),
    )
  }, [])

  const value = useMemo(
    () => ({
      categories,
      documents: documentList,
      getCategoryById,
      getDocumentById,
      getDocumentsByCategory,
      getCategoryDocumentCount,
      search,
      createCategory,
      updateCategory,
      deleteCategory,
      addDocument,
      updateDocument,
      deleteDocument,
      moveDocumentToCategory,
    }),
    [
      categories,
      documentList,
      getCategoryById,
      getDocumentById,
      getDocumentsByCategory,
      getCategoryDocumentCount,
      search,
      createCategory,
      updateCategory,
      deleteCategory,
      addDocument,
      updateDocument,
      deleteDocument,
      moveDocumentToCategory,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}
