import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pixel Cat",
  description: "A Pixel Painting Tool, For child, For pixel game",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
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
