import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ハイキャリア転職診断 | あなたのコンサル適性を16タイプで診断",
  description:
    "MBTIのように4軸16タイプでコンサルタント適性を診断。現在のスキル・年収を入力してAIが分析。年収ジャンプアップの可能性を可視化します。",
  openGraph: {
    title: "ハイキャリア転職診断",
    description: "あなたのコンサル適性を16タイプで診断",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-[#0a0a1a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
