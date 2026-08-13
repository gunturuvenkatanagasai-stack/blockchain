import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Digital Human Marketplace — Algorand x402 Micropayments",
  description: "Synthesize verified expertise into AI Digital Twins monetized via x402 on Algorand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
