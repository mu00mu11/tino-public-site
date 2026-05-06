import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TINO — Girl's Bar 大塚",
  description: "大塚ガールズバーTINO 公式サイト。出勤キャスト・座席・営業状況を毎日更新。",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#0a0a0a]">{children}</body>
    </html>
  );
}
