import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poupagaio | Controle financeiro",
  description: "Organize hoje. Voe mais longe.",
  icons: {
    icon: "/logo-poupagaio-icone.png",
    apple: "/logo-poupagaio-icone.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
