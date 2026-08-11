import { ReactNode } from "react";
import { Metadata } from "next";
import { Manrope, Merienda } from "next/font/google";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "modern-normalize/modern-normalize.css";
import "@/styles/reset.css";
import "@/styles/base.css";
import "@/styles/container.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const TITLE = "Harmoniq";
const DESCRIPTION = "Harmoniq — mindful publishing platform for mental health and well-being";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;

  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${merienda.variable}`}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>
              {children} {modal}
            </main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
