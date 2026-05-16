import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import AdminBar from "@/components/AdminBar";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  metadataBase: new URL('https://ekacahya.web.app'),
  title: "Nanang Eka Cahya Pernata | Senior Web Engineer",
  description: "Backend-focused full-stack engineer building reliable API platforms, microservices, and operational systems.",
  openGraph: {
    title: "Nanang Eka Cahya Pernata | Senior Web Engineer",
    description: "Backend-focused full-stack engineer for production APIs, microservices, and operational systems.",
    type: "website",
    images: ["/profile.jpg"],
  },
  twitter: {
    card: "summary",
    title: "Nanang Eka Cahya Pernata | Senior Web Engineer",
    description: "Backend-focused full-stack engineer for production APIs, microservices, and operational systems.",
    images: ["/profile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body>
        <AuthProvider>
          <AdminBar />
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
