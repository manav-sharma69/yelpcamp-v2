import "@radix-ui/themes/styles.css";
import './globals.css';
import { suse, montserrat } from '@/utils/fonts/font';

import { Theme, Flex } from "@radix-ui/themes";
import ToastProvider from "@/components/ToastProvider";
import ToastShelf from "@/components/Toast/Toast";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import React from "react";

export const metadata = {
  title: 'YelpCamp',
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" className={`${suse.variable} ${montserrat.variable}`}>
      <body>
        <SessionProvider>
          <ToastProvider>
            <Theme accentColor="brown" style={{ height: '100%' }}>
              <Flex direction={'column'} minHeight={'100%'}>
                <React.Suspense fallback={<p>Loading Navbar... -Suspense (layout.js | RootLayout)</p>}>
                  <Navbar />
                </React.Suspense>
                {children}
              </Flex>
              <ToastShelf />
            </Theme>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
