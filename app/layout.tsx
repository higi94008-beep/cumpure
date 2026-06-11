import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: "Nature's Harvest – Gourmet Grocery & Fresh Produce",
  description: "Premium quality organic foods, fresh produce, imported gourmet products, artisan dairy, bakery, and more. Delivered fresh to your door.",
  keywords: "organic food, gourmet grocery, fresh produce, artisan cheese, premium foods",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#333', color: '#fff' } }} />
      </body>
    </html>
  )
}
