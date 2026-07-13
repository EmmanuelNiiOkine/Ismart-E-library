import type { Category, Document, User } from '../types'

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Law Reports',
    description: 'Published judicial decisions and official law reports from superior courts.',
    documentCount: 48,
    order: 1,
  },
  {
    id: 'cat-2',
    name: 'Court Cases',
    description: 'Case law, court opinions, and appellate decisions from Ghana and other jurisdictions.',
    documentCount: 62,
    order: 2,
  },
  {
    id: 'cat-3',
    name: 'Statutes & Legislation',
    description: 'Acts of Parliament, session laws, codes, and subsidiary legislation.',
    documentCount: 35,
    order: 3,
  },
  {
    id: 'cat-4',
    name: 'Constitutional Law',
    description: 'Constitutions, constitutional instruments, and related convention materials.',
    documentCount: 12,
    order: 4,
  },
  {
    id: 'cat-5',
    name: 'Administrative Regulations',
    description: 'Regulations, directives, and rules issued by government agencies and regulators.',
    documentCount: 28,
    order: 5,
  },
  {
    id: 'cat-6',
    name: 'Legal Textbooks & Treatises',
    description: 'Authoritative books, treatises, and reference works on legal subjects.',
    documentCount: 41,
    order: 6,
  },
  {
    id: 'cat-7',
    name: 'Practice Guides & Form Books',
    description: 'Procedural guides, form books, and practical legal handbooks.',
    documentCount: 19,
    order: 7,
  },
  {
    id: 'cat-8',
    name: 'Legal Journals & Periodicals',
    description: 'Law reviews, journals, and periodical publications.',
    documentCount: 24,
    order: 8,
  },
]

export const documents: Document[] = [
  {
    id: 'doc-test-pdf',
    title: 'SPIVA Australia Year-End 2024',
    description: 'Test PDF upload — real document rendered inside the flip-book reader.',
    author: 'S&P Dow Jones Indices',
    categoryId: 'cat-8',
    publicationYear: 2024,
    keywords: ['test', 'pdf', 'spiva', 'australia'],
    fileSize: '316 KB',
    uploadDate: '2026-07-13',
    uploadedBy: 'Test Upload',
    filePath: '/samples/spiva-australia-year-end-2024.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-test-docx',
    title: 'iSmartPay Dashboard Issues',
    description: 'Test Word document — content extracted and paginated in the reader.',
    author: 'iSmart Ghana',
    categoryId: 'cat-7',
    publicationYear: 2026,
    keywords: ['test', 'docx', 'ismartpay', 'dashboard'],
    fileSize: '18 KB',
    uploadDate: '2026-07-13',
    uploadedBy: 'Test Upload',
    filePath: '/samples/ismartpay-dashboard-issues.docx',
    fileType: 'docx',
    downloadEnabled: true,
  },
  {
    id: 'doc-1',
    title: 'Republic v. Mensah [2024] GHASC 12',
    description: 'Supreme Court decision on constitutional interpretation regarding due process.',
    author: 'Supreme Court of Ghana',
    categoryId: 'cat-2',
    publicationYear: 2024,
    keywords: ['constitutional law', 'due process', 'criminal procedure'],
    fileSize: '2.4 MB',
    uploadDate: '2026-06-15',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-2',
    title: 'Ghana Law Reports Vol. 112 (2023)',
    description: 'Official compilation of reported decisions from the Court of Appeal.',
    author: 'Ghana Law Reports Committee',
    categoryId: 'cat-1',
    publicationYear: 2023,
    keywords: ['law reports', 'court of appeal', 'reported cases'],
    fileSize: '18.7 MB',
    uploadDate: '2026-05-28',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-3',
    title: 'Companies Act, 2019 (Act 992)',
    description: 'Primary legislation governing incorporation, management, and winding up of companies.',
    author: 'Parliament of Ghana',
    categoryId: 'cat-3',
    publicationYear: 2019,
    keywords: ['companies', 'corporate law', 'act 992'],
    fileSize: '5.1 MB',
    uploadDate: '2026-04-10',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/administration-of-estates-act-1961.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-4',
    title: 'Constitution of the Republic of Ghana (1992)',
    description: 'The supreme law of Ghana as amended, including all constitutional amendments.',
    author: 'Parliament of Ghana',
    categoryId: 'cat-4',
    publicationYear: 1992,
    keywords: ['constitution', 'fundamental rights', 'governance'],
    fileSize: '3.8 MB',
    uploadDate: '2026-03-22',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-5',
    title: 'Bentsi-Enchill: Ghana Land Law (2nd Ed.)',
    description: 'Comprehensive treatise on land tenure, registration, and conveyancing in Ghana.',
    author: 'Nii Amaa Ollennu',
    categoryId: 'cat-6',
    publicationYear: 2022,
    keywords: ['land law', 'conveyancing', 'tenure'],
    fileSize: '24.3 MB',
    uploadDate: '2026-06-01',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-6',
    title: 'Bank of Ghana Directive on Electronic Money Issuers',
    description: 'Regulatory framework for licensing and supervision of electronic money issuers.',
    author: 'Bank of Ghana',
    categoryId: 'cat-5',
    publicationYear: 2025,
    keywords: ['fintech', 'regulation', 'electronic money'],
    fileSize: '1.2 MB',
    uploadDate: '2026-06-20',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-7',
    title: 'Akosombo Textiles Ltd v. Attorney-General [2023] GHASC 8',
    description: 'Landmark commercial law decision on government liability and contractual obligations.',
    author: 'Supreme Court of Ghana',
    categoryId: 'cat-2',
    publicationYear: 2023,
    keywords: ['commercial law', 'government liability', 'contracts'],
    fileSize: '1.9 MB',
    uploadDate: '2026-05-14',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-8',
    title: 'Civil Procedure Rules (C.I. 47)',
    description: 'High Court civil procedure rules governing litigation practice in Ghana.',
    author: 'Judicial Service of Ghana',
    categoryId: 'cat-5',
    publicationYear: 2020,
    keywords: ['civil procedure', 'court rules', 'litigation'],
    fileSize: '4.6 MB',
    uploadDate: '2026-02-18',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-9',
    title: 'Review of Ghanaian Law Vol. 56 (2024)',
    description: 'Annual law review journal featuring articles on contemporary legal issues.',
    author: 'Ghana School of Law',
    categoryId: 'cat-8',
    publicationYear: 2024,
    keywords: ['journal', 'legal scholarship', 'review'],
    fileSize: '8.3 MB',
    uploadDate: '2026-06-08',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
  {
    id: 'doc-10',
    title: 'Conveyancing Practice in Ghana: A Practitioners Guide',
    description: 'Step-by-step guide to property conveyancing transactions and documentation.',
    author: 'Legal Practice Board',
    categoryId: 'cat-7',
    publicationYear: 2021,
    keywords: ['conveyancing', 'practice guide', 'property'],
    fileSize: '6.7 MB',
    uploadDate: '2026-01-30',
    uploadedBy: 'Kwame Asante',
    filePath: '/samples/ismart-library-sample.pdf',
    fileType: 'pdf',
    downloadEnabled: true,
  },
]

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Kwame Asante',
    email: 'kwame.asante@ismartghana.com',
    employeeId: 'ISM-001',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 'user-2',
    name: 'Ama Osei',
    email: 'ama.osei@ismartghana.com',
    employeeId: 'ISM-042',
    role: 'employee',
    status: 'active',
    createdAt: '2024-03-20',
  },
  {
    id: 'user-3',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@ismartghana.com',
    employeeId: 'ISM-078',
    role: 'employee',
    status: 'active',
    createdAt: '2024-06-10',
  },
  {
    id: 'user-4',
    name: 'Efua Boateng',
    email: 'efua.boateng@ismartghana.com',
    employeeId: 'ISM-103',
    role: 'employee',
    status: 'disabled',
    createdAt: '2024-08-05',
  },
  {
    id: 'user-5',
    name: 'Yaw Darko',
    email: 'yaw.darko@ismartghana.com',
    employeeId: 'ISM-156',
    role: 'employee',
    status: 'active',
    createdAt: '2025-01-12',
  },
]

export const demoCredentials = {
  admin: { email: 'admin@ismartghana.com', password: 'admin123' },
  employee: { email: 'employee@ismartghana.com', password: 'employee123' },
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id)
}

export function getDocumentsByCategory(categoryId: string) {
  return documents.filter((d) => d.categoryId === categoryId)
}

export function getDocumentById(id: string) {
  return documents.find((d) => d.id === id)
}

export function searchDocuments(query: string, categoryId?: string) {
  const q = query.toLowerCase().trim()
  return documents.filter((doc) => {
    if (categoryId && doc.categoryId !== categoryId) return false
    if (!q) return true
    const category = getCategoryById(doc.categoryId)
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.author.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.keywords.some((k) => k.toLowerCase().includes(q)) ||
      category?.name.toLowerCase().includes(q)
    )
  })
}
