"use client"

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import MainLayout from "./MainLayout";
import GuestLayout from "./GuestLayout";


interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const access_token = Cookies.get('access_token')

    const [validToken, setValidToken] = useState(false);

    const router = useRouter()

    useEffect(() => {
        if (access_token) {
            setValidToken(true);
        }
    }, [access_token]);

    useEffect(() => {
        if (!validToken) {
            router.refresh();
        }
    }, [validToken, router]);

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {validToken ? (
                <MainLayout>{children}</MainLayout>
            ) : (
                <GuestLayout>{children}</GuestLayout>
            )}
        </div>
    );
}