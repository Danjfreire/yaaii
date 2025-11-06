
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatProvider } from "@/contexts/ChatContext";
import "./globals.css";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YAAII - Yet Another AI Interface",
  description: "A modern web interface for interacting with Ollama models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              if (localStorage.getItem('darkMode') === 'true') {
                document.documentElement.classList.add('dark')
              }
            } catch (e) {}
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChatProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ChatProvider>
      </body>
    </html>
  );
}
