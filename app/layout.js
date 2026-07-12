import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "План Победы — Exodus Church",
  description: "Ежедневный план чтения Библии Exodus Church",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg"
  }
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
