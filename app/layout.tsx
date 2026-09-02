import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "משרד שמעון — מתכנן חזית וקירות",
  description: "תצורת קירות אבן, מדרגות ורחבה + הפקת פרומפט ל-Nano Banana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
