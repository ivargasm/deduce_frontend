"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/Store";
import SessionWatcher from "./SessionWatcher";
import Loader from "./Loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { userAuth, userValid, isLoading } = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            await userValid();
            const { userAuth, user } = useAuthStore.getState();
            if (!userAuth) {
                router.push("/auth/login");
            } else if (window.location.pathname.startsWith("/dashboard/admin") && user?.role !== 'admin') {
                router.push("/dashboard");
            }
        };
        checkAuth();
    }, [router, userValid]);

    if (isLoading) {
        return <Loader />;
    }

    return userAuth ? (
        <>
            {children}
            <SessionWatcher />
        </>
    ) : null;
}