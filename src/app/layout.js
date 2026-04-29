import "./globals.css";

export const metadata = {
  title: "Carrom Tournament — NIT Championship",
  description: "NIT Carrom Championship — live match tracking, leaderboards, and tournament results.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to Google Fonts to reduce latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Inter with display=swap to avoid render blocking */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" style={{ background: '#080F1C', color: '#F0F4FF' }}>
        {children}
      </body>
    </html>
  );
}
