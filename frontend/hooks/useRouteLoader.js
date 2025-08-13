// hooks/useRouteLoader.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useRouteLoader() {
    const [isRouting, setIsRouting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStart = () => setIsRouting(true);
        const handleStop = () => setIsRouting(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router]);

    return isRouting;
}
