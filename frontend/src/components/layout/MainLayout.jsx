import Sidebar from './Sidebar'

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-14 md:mt-0">
        {children}
      </main>
    </div>
  )
}