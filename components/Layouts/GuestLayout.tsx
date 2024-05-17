'use client'
/* eslint-disable @next/next/no-html-link-for-pages */
import { ReactNode, useEffect, useState } from "react"
import Loader from "../common/Loader";
import Cookies from 'js-cookie';

interface GuestLayoutProps {
    children: ReactNode
}
export default function GuestLayout({ children }: GuestLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [loading, setLoading] = useState<boolean>(true);

    const userCookie = Cookies.get('access_token')

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);

        return () => {
            clearTimeout(timer)
        }
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="flex h-screen overflow-hidden">
                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {/* <!-- ===== Guest Content Start ===== --> */}
                        <main>
                            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                                {children}
                            </div>
                        </main>
                        {/* <!-- ===== Guest Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
            )}
        </>
    )
}