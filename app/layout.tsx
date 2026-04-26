import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Finanças Pessoais",
  description: "Controle suas finanças pessoais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 md:overflow-auto pb-20 md:pb-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}