import type { Metadata } from "next";
import "./globals.css";
import Provider from './provider'

export const metadata: Metadata = {
  title: "J Forum | SC363204 Java Web Application Development",
  description: "Developed by OSP101 | Powered by Spring Boot + Next.JS + TailwindCSS. Teaching media for SC363204 Java Web Application Development. All rights reserved.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(
    '%c สวัสดี! ' +
    '%cพัฒนาโดย OSP101 | ขับเคลื่อนโดย Spring Boot + Next.JS + TailwindCSS สื่อการสอนสำหรับการพัฒนาแอปพลิเคชันเว็บด้วย Java SC363204 สงวนลิขสิทธิ์',
    'background: #ffff00; color: #ff0000; font-size: 18px; font-weight: bold; padding: 2px;',
    'color: white; background: #444; font-size: 14px; padding: 2px;'
);
  return (
    <html lang="en">
      <body>
        
        <Provider children={children} />
      </body>
    </html>
  );
}
