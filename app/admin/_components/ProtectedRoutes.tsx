"use client";

import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { useEffect, useState } from "react";

export default function ProtectedRoutes({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setAllowed(false);
                setLoading(false);
                router.replace("/admin/login");
                return;
            }

            setAllowed(true);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!allowed) {
        return null;
    }

    return <>{children}</>;
}