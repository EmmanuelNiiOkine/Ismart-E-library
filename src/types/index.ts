export type UserRole = 'admin' | 'employee'
export type UserStatus = 'active' | 'disabled'

export interface User {
  id: string
  name: string
  email: string
  employeeId?: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  documentCount: number
  order: number
}

export type DocumentFileType = 'pdf' | 'docx' | 'sample'

export interface Document {
  id: string
  title: string
  description: string
  author: string
  categoryId: string
  publicationYear: number
  keywords: string[]
  fileSize: string
  uploadDate: string
  uploadedBy: string
  filePath: string
  fileType?: DocumentFileType
  downloadEnabled: boolean
  coverImageUrl?: string | null
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}
