'use client'
/* eslint-disable @next/next/no-html-link-for-pages */

import { useAuthStore } from "@/lib/store/auth";

export default function Analytic() {
    const { user } = useAuthStore()
    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Welcome, {user && user.name}
                </h2>
            </div>
        </>
    );
}
