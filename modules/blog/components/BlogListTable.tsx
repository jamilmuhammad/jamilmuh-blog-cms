"use client"
/* eslint-disable @next/next/no-html-link-for-pages */
import { useMemo } from "react"
import useSWR from "swr"

import { fetcher } from "@/services/fetcher"
import { Blog } from "@/commons/types/blog"
import EmptyState from "@/components/common/elements/EmptyState"
import Loader from "@/components/common/Loader"
import BlogItem from "./BlogItem"

export default function BlogListTable() {
    // const { data: session } = useSession()

    const API_URL_BLOG = 'https://jamilmuhammad.my.id/api/v1/'

    const { data, error } = useSWR(`${API_URL_BLOG}article`, fetcher)

    const blogData: Blog[] = useMemo(() => {
        if (data?.data && Array.isArray(data?.data)) {
            return data.data;
        }
        return [];
    }, [data?.data]);

    if (error || blogData.length === 0) {
        return <EmptyState message={data?.message ? data?.message : 'No Data'} />
    }

    if (!blogData) {
        return <Loader />
    }

    return (
        <>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-600 text-left dark:bg-gray-300">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Title
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Summary
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Image
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogData?.map((entry, index) => (
                                <BlogItem key={index} entry={entry} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}