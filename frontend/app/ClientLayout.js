// app/ClientLayout.jsx
'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Core loader CSS
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from "./context/AuthContext";
import AOSinit from "@/components/AOSinit";
import LayoutWraper from "@/components/LayoutWraper";

NProgress.configure({ showSpinner: false, speed: 400 });

export default function ClientLayout({ children }) {
    const pathname = usePathname();

    useEffect(() => {
        NProgress.start();
        const timer = setTimeout(() => {
            NProgress.done();
        }, 300); // smooth experience
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AuthProvider>
            <AOSinit />
            <LayoutWraper>{children}</LayoutWraper>
            <Toaster
               position="top-center" reverseOrder={false}
            />
        </AuthProvider>
    );
}
