import "./globals.css";

export const metadata = {
  title: "Carrom Tournament",
  description: "NIT Carrom Championship — matches, leaderboards, results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased" style={{ background: '#080F1C', color: '#F0F4FF' }}>
        {children}
      </body>
    </html>
  );
}
