import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'
import './globals.css'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/providers/toaster-provider'
import { ApolloWrapper, ConfettiProvider } from '@/components/providers'
import { WalletProvider } from '@/components/providers/wallet-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS (Learning Management System)',
  description: 'LMS (Learning Management System)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const delay = Number(cookieStore.get('apollo-x-custom-delay')?.value ?? 1000)

  return (
    <WalletProvider>
      <ClerkProvider>
        <ApolloWrapper delay={delay}>
        <html lang="en">
          <body className={inter.className}>
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </body>
        </html>
        </ApolloWrapper>
      </ClerkProvider>
    </WalletProvider>
  )
}
