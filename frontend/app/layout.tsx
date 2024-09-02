import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers'
import { WalletProvider } from '@/components/providers/wallet-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS (Learning Management System)',
  description: 'LMS (Learning Management System)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={inter.className}>
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </WalletProvider>
  )
}
