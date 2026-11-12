"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../store/Store";
import SessionWatcher from "./SessionWatcher";
import Loader from "./Loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, userAuth, userValid, isLoading } = useAuthStore();

    useEffect(() => {
        userValid();
    }, [userValid]);

    useEffect(() => {
        if (isLoading) return;
        if (!userAuth) {
            router.replace("/auth/login");
        } else if (pathname?.startsWith("/dashboard/admin") && user?.role !== "admin") {
            router.replace("/dashboard");
        }
    }, [isLoading, userAuth, user, pathname, router]);

    if (isLoading) {
        return <Loader />;
    }

    if (!userAuth) {
        return null;
    }

    if (pathname?.startsWith("/dashboard/admin") && user?.role !== "admin") {
        return null;
    }

    return (
        <>
            {children}
            <SessionWatcher />
        </>
    );
}