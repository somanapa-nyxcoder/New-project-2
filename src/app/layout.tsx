import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roommate Meal Planner",
  description: "Mobile-friendly meal and grocery planner for shared homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
