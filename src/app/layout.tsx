import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/app/components/Provider";
import { Header } from "./components/Header";
import { Container } from "@chakra-ui/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Over Drive",
  description: "ドライブ用のプレイリストを自動で作れるアプリです",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header title="Over Drive" />
          <Container h={100} maxW="100%">
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
