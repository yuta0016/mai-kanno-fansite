import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zen-maru-gothic",
});

export const metadata: Metadata = {
  title: "菅野真衣ファンサイト",
  description: "声優 菅野真衣さんの非公式ファンサイトです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenMaruGothic.variable} antialiased`}
        style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
