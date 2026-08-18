import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ProvedorAutenticacao } from "@/lib/contexto-autenticacao";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Minhas Garantias",
  description: "Controle as garantias dos seus produtos em um só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <ProvedorAutenticacao>{children}</ProvedorAutenticacao>
      </body>
    </html>
  );
}
