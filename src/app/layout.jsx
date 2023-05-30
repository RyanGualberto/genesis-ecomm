import "./globals.css";
import QueryClientContextProvider from "@/contexts/queryClientProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Genesis E-Comm",
  description: "Genesis E-Comm",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col gap-8">
        <QueryClientContextProvider>
          {children}
          <Toaster position="top-right" />
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
