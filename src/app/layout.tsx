import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/use-auth';
import { BookmarksProvider } from '@/hooks/use-bookmarks';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ms Stories',
  description: 'Read, Write & Earn',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          defaultTheme="system"
          storageKey="ms-stories-theme"
        >
          <AuthProvider>
            <BookmarksProvider>
              {children}
              <Toaster />
            </BookmarksProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
