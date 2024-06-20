import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import ToastProvider from "@/components/Providers/Toast";
import Layout from "@/components/Layouts/Layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ToastProvider>
          <Layout>
            {children}
          </Layout>
        </ToastProvider>
      </body>
    </html>
  );
}
