import { Navbar } from "@/components";
import { AuthProvider } from "@/contexts/authContext";
import { SearchProvider } from "@/contexts/searchContext";

export default function AuthenticatedRoutes({ children }) {
  return (
    <AuthProvider>
      <SearchProvider>
        <Navbar />
        {children}
      </SearchProvider>
    </AuthProvider>
  );
}
