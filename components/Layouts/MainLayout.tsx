'use client'
/* eslint-disable @next/next/no-html-link-for-pages */
import { ReactNode, useEffect, useState } from "react"
import Sidebar from "../Sidebar"
import Header from "../Header";
import Loader from "../common/Loader";
import Cookies from 'js-cookie';

interface MainLayoutProps {
    children: ReactNode
}
export default function MainLayout({ children }: MainLayoutProps) {
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
                    {/* <!-- ===== Sidebar Start ===== --> */}
                    {userCookie && (<Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />)}
                    {/* <!-- ===== Sidebar End ===== --> */}

                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {/* <!-- ===== Header Start ===== --> */}
                        {userCookie && (
                            <Header
                                sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />)}
                        {/* <!-- ===== Header End ===== --> */}

                        {/* <!-- ===== Main Content Start ===== --> */}
                        <main>
                            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                                {children}
                            </div>
                        </main>
                        {/* <!-- ===== Main Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
            )}
        </>
    )
}