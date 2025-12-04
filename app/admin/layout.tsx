import { AdminHeader } from '@/components/layout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER RESPONSIVE IMPORTATO */}
      <AdminHeader />

      {/* CONTENUTO PRINCIPALE */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}