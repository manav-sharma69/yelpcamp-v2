import { Inter, Montserrat, SUSE, Antic_Slab, Redacted_Script } from 'next/font/google';

export const redactedScipt = Redacted_Script({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-redacted-script',
});

export const anticSlab = Antic_Slab({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-antic-slab'
});

export const inter = Inter({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter'
});

export const montserrat = Montserrat({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat'
});

export const suse = SUSE({
  weight: "variable",
  subsets: ['latin', 'latin-ext'],
  variable: '--font-suse'
});