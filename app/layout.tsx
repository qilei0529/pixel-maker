import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pixel Kiki",
  description: "Just a Pixel Art Tool",
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      {process.env.NODE_ENV === "production" ? (
        <GoogleAnalytics gaId="G-QV3SCKYHS1" />
      ) : null}
    </html>
  )
}
