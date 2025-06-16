import React from "react"; // Changed from import { ReactNode } to import React

export default function Layout({ children }) {
  // The main container and column sizing will be handled by individual pages
  // or by a more specific layout component if needed.
  // This keeps the default Layout simple and flexible.
  return <>{children}</>;
}
