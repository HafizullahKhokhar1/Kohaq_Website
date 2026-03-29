import type { Metadata } from "next";
import { Montserrat, Oswald, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const headingFont = Montserrat({
  variable: "--font-heading",
  weight: ["700", "800"],
  subsets: ["latin"],
});

const labelFont = Oswald({
  variable: "--font-label",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kohaq Platform",
  description: "KOHAQ - New Tomorrow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${headingFont.variable} ${labelFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
