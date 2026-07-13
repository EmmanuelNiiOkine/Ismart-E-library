import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppLoadingProvider } from './contexts/AppLoadingContext'
import { LibraryProvider } from './contexts/LibraryContext'
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { AuthLayout } from './components/layout/AuthLayout'

import { EmployeeLogin } from './pages/auth/EmployeeLogin'
import { AdminLogin } from './pages/auth/AdminLogin'

import { EmployeeDashboard } from './pages/employee/Dashboard'
import { Library } from './pages/employee/Library'
import { Categories } from './pages/employee/Categories'
import { CategoryDetail } from './pages/employee/CategoryDetail'
import { SearchResults } from './pages/employee/SearchResults'
import { DocumentViewer } from './pages/employee/DocumentViewer'
import { Reader } from './pages/employee/Reader'
import { ReaderLayout } from './components/layout/ReaderLayout'
import { Profile } from './pages/employee/Profile'

import { AdminDashboard } from './pages/admin/Dashboard'
import { UserManagement } from './pages/admin/UserManagement'
import { CategoryManagement } from './pages/admin/CategoryManagement'
import { AdminCategoryDetail } from './pages/admin/AdminCategoryDetail'
import { DocumentManagement } from './pages/admin/DocumentManagement'
import { UploadDocument } from './pages/admin/UploadDocument'
import { EditDocument } from './pages/admin/EditDocument'
import { SystemSettings } from './pages/admin/SystemSettings'

export default function App() {
  return (
    <AppLoadingProvider>
      <BrowserRouter>
        <AuthProvider>
          <LibraryProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
            <Route path="/login" element={<EmployeeLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']}><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/documents/:id" element={<DocumentViewer />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']}><ReaderLayout /></ProtectedRoute>}>
            <Route path="/read/:id" element={<Reader />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']}><AppLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/categories/:id" element={<AdminCategoryDetail />} />
            <Route path="/admin/documents" element={<DocumentManagement />} />
            <Route path="/admin/documents/:id/edit" element={<EditDocument />} />
            <Route path="/admin/upload" element={<UploadDocument />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
          </LibraryProvider>
        </AuthProvider>
      </BrowserRouter>
    </AppLoadingProvider>
  )
}
