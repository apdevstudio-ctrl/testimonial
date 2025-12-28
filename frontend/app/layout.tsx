import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Testimonial SaaS Dashboard',
  description: 'Manage your testimonial collection and display',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ToastProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}

