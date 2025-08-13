// 'use client';

// // import { Geist, Geist_Mono } from "next/font/google";

// import { Navbar } from "@/components/Navbar";
// import "./globals.css";
// import "../styles/navbar.css";
// import "../styles/footer.css";
// import "../styles/account.css";
// import { Footer } from "@/components/Footer";
// import Dummy from "@/components/Dummy";
// import AOSinit from "@/components/AOSinit";
// import LayoutWraper from "@/components/LayoutWraper";
// import Head from "next/head";
// import { Roboto } from "next/font/google";
// import { AuthProvider } from "./context/AuthContext";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; 
// // const geistSans = Geist({
// //   variable: "--font-geist-sans",
// //   subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });

// import "../../styles/nprogress.css"; // ✅ Make sure this exists
// import NProgress from "nprogress";
// import "nprogress/nprogress.css";
// import { usePathname } from "next/navigation";

// const roboto = Roboto({
//     subsets: ["roboto"],
//     weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });
// export const metadata = {
//     title: "Shopping",
//     description: "Buy and sell products",
// };

// export default function RootLayout({ children }) {
//     return (
//         <html lang="en">
//             <body className={`${roboto.className}`}>
//                 <AuthProvider>
//                     <AOSinit />
//                     {/* <Dummy/> */}
//                     {/* <Navbar/> 
//                        {children}
//                         <Footer/> */}

//                     <LayoutWraper>{children}</LayoutWraper>
//                      <ToastContainer
//                         position="top-right"
//                         autoClose={3000} // ⏳ Hide after 3 seconds
//                         hideProgressBar={false}
//                         newestOnTop
//                         closeOnClick
//                         pauseOnHover
//                         theme="light"
//                     />
//                 </AuthProvider>
//             </body>
//         </html>
//     );
// }

// app/layout.js (✅ Server Component — no 'use client')

import { Roboto } from "next/font/google";
import "./globals.css";
import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/account.css";
import "../styles/nprogress.css"; // Required for progress bar style

import ClientLayout from "./ClientLayout"; // 👈 You’ll create this next

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
    title: "Shopping",
    description: "Buy and sell products",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={roboto.className}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
