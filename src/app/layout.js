import { montserrat, suse } from '@/utils/fonts/font'
import '@radix-ui/themes/styles.css'
import './globals.css'

import Attribution from '@/components/Attribution'
import Navbar from '@/components/Navbar'
import SessionProvider from '@/components/SessionProvider'
import ToastShelf from '@/components/Toast/Toast'
import ToastProvider from '@/components/ToastProvider'
import { Flex, Theme } from '@radix-ui/themes'
import React from 'react'

export const metadata = {
  title: 'YelpCamp'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${suse.variable} ${montserrat.variable}`}>
      <body>
        <SessionProvider>
          <ToastProvider>
            <Theme accentColor="brown" style={{ height: '100%' }}>
              <Flex direction={'column'} minHeight={'100%'}>
                <React.Suspense
                  fallback={
                    <p>Loading Navbar... -Suspense (layout.js | RootLayout)</p>
                  }
                >
                  <Navbar />
                </React.Suspense>
                {children}
                <Attribution />
              </Flex>
              <ToastShelf />
            </Theme>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
