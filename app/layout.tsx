"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { useState, useEffect } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import ToastProvider from "@/components/Providers/Toast";
import GuestLayout from "@/components/Layouts/GuestLayout";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const access_token = Cookies.get('access_token')

  const [validToken, setValidToken] = useState(false);

  const router = useRouter()

  useEffect(() => {
    if (access_token) {
      setValidToken(true);
    }
  }, [access_token]);

  useEffect(() => {
    if (!validToken) {
      router.refresh();
    }
  }, [validToken]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ToastProvider>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {validToken ? (
              <MainLayout>{children}</MainLayout>
            ) : (
              <GuestLayout>{children}</GuestLayout>
            )}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
