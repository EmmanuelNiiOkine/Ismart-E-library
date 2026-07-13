import { Outlet } from 'react-router-dom'

export function ReaderLayout() {
  return (
    <div className="reader-shell min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
