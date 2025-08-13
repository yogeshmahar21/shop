"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "../app/context/AuthContext";


export default function LayoutWraper({ children }) {
    const pathname = usePathname();

    const noLayoutPaths = ["/auth/login", "/auth/signup", "/admin"];

    const hideLayout = noLayoutPaths.includes(pathname);

    return (
        <>
        <AuthProvider>
            {!hideLayout && <Navbar />}
            {children}
            {!hideLayout && <Footer />}
        </AuthProvider>
        </>
    );
}
