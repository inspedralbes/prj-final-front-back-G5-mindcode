import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

// Elegant serif for headings
const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Clean sans-serif for body
const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: "MindCode",
  description: "Interactive programming learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}