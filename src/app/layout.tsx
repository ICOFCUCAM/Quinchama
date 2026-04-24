import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quinchama Academy",
  description: "School management system for Quinchama Academy — students, teachers, finances, payments and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
