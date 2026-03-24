import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ハイキャリア転職診断 | コンサル適性を8タイプで診断",
  description:
    "28問・約5分のAI診断で、コンサルタント適性と年収ジャンプアップの可能性を数値化。現在のスキル・年収を入力してAIが分析します。",
  openGraph: {
    title: "ハイキャリア転職診断 | コンサル適性を8タイプで診断",
    description: "あなたのコンサル適性と年収ジャンプアップ可能性を無料でAI診断",
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
      <body className={`${notoSansJP.className} min-h-full bg-[#090b1a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
