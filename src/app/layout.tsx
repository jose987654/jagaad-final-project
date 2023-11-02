import '@/app/globals.scss';
import type { Metadata } from 'next'
import { poppins } from './ui/fonts'
import Header from './ui/components/Header';
import Footer from './ui/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Meubel House',
    default: 'Meubel House',
  },
  description: 'Boutique furniture store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}