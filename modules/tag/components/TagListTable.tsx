"use client"
/* eslint-disable @next/next/no-html-link-for-pages */
import { ChangeEvent, Suspense, useEffect, useMemo, useRef, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

import { fetcher } from "@/services/fetcher"
import { Tag } from "@/commons/types/blog"
import EmptyState from "@/components/common/elements/EmptyState"
import Loader from "@/components/common/Loader"
import TagItem from "./TagItem"
import PaginationDefault from "@/components/Pagination/PaginationDefault"
import useDebounce from "@/lib/debounce.lib"
import CheckboxSelectAll from "@/components/Checkboxes/CheckboxSelectAll"
import { FiTrash } from "react-icons/fi"
import { toast } from "react-toastify"
import { ProgressCard } from "@/components/common/elements/ProgressCard"

export default function TagListTable() {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const debouncedValue = useDebounce(search, 500);
    const searchRef = useRef<any>(null);

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([] as number[]);

    const [url, setUrl] = useState(`${process.env.NEXT_PUBLIC_API_URL}tag?is_pagination=true&page=${page}&limit=${limit}`);

    useEffect(() => {
        if (page && limit && (debouncedValue || search.length <= 0)) {
            return setUrl(`${process.env.NEXT_PUBLIC_API_URL}tag?is_pagination=true&q=${debouncedValue}&page=${page}&limit=${limit}`)
        }
    }, [page, limit, debouncedValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { name, value } = e.target;
        setSearch(value || '');
        setPage(1)
        if (!value || value == '') {
            setPage((prevState: number) => (prevState))
        }
    };

    const resetQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()        
        searchRef.current.value = ''
        setSearch('');
        setPage((prevState: number) => (prevState))
    };

    const { data, error, isLoading } = useSWR(`${url}`, fetcher)

    const blogData: Tag[] = useMemo(() => {
        if (data?.data && Array.isArray(data?.data)) {
            return data.data;
        }
        return [];
    }, [data?.data]);

    if (!blogData) {
        return <Loader />
    }

    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        
        setIsCheckAll(!isCheckAll);
        if (isCheck.length == 0) {
            setIsCheck(blogData.map((li: Tag) => li.id as number));
        }
        if (isCheckAll || isCheck.length > 0) {
            setIsCheck([]);
        }
    };

    const handleClick = (e: ChangeEvent<HTMLInputElement>): void => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
            setIsCheck(isCheck.filter((item: number) => item != parseInt(id)));
        }
    };

    const { mutate } = useSWRConfig()

    enum FormState {
        Default,
        Loading,
        Process,
        Success,
        Error,
    }

    interface FormDefaultProps {
        state?: FormState,
        message?: string | null
    }

    const FormDefault: FormDefaultProps = {
        state: FormState.Default,
        message: ''
    }

    const [form, setForm] = useState(FormDefault)
    const [progressStatus, setProgressStatus] = useState(0);

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    }
    const handleClose = () => {
        setShow(false);
    }

    const API_URL_TAG = `${process.env.NEXT_PUBLIC_API_URL}tag`

    useMemo(() => {
        if (progressStatus >= 100) {
            setProgressStatus(100)
        }
    }, [progressStatus])

    const handleDeleteModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setForm((prevData: FormDefaultProps) => ({ ...prevData, state: FormState.Default }))
        handleShow()
    }

    const deleteEntry = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const progressPart = (100 / isCheck.length)

        setForm((prevData: FormDefaultProps) => ({ ...prevData, state: FormState.Loading }))

        isCheck.map(async (e) => {
            const res = await fetch(`${API_URL_TAG}/${e}`, {
                method: "DELETE",
            })

            const { error, message } = await res.json()

            if (error) {
                setForm((prevData: FormDefaultProps) => ({
                    ...prevData,
                    state: FormState.Error,
                    message: message,
                }))
                toast.error(message);
            } else {

                var progress: number = 0

                progress += progressPart

                setProgressStatus(progress)

                setForm((prevData: FormDefaultProps) => ({ ...prevData, state: FormState.Process }))

            }
        })

        if (form.state != FormState.Error && !form.message) {
            mutate(`${API_URL_TAG}`)

            setForm((prevData: FormDefaultProps) => ({
                ...prevData,
                state: FormState.Success,
                message: `Successfully, delete tags!`,
            }))

            toast.success('Successfully, delete tags!');

            handleClose()
        }

    }

    return (
        <>
            <div className="w-full rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-600 dark:bg-gray-300">
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    <div>
                                        {(isCheck.length > 0) && (
                                            <button className="hover:text-primary" onClick={handleDeleteModal}>
                                                <Suspense>
                                                    <FiTrash />
                                                </Suspense>
                                            </button>
                                        )}
                                        <div className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${show ? '' : 'hidden'}`}>
                                            <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                                                {(form.state == FormState.Default) && (
                                                    <>
                                                        <span className="mx-auto inline-block"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
                                                            <path d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                        </span>
                                                        <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">Warning</h3>
                                                        <p className="mb-10">Are you sure want to delete this?</p>
                                                        <p className="mb-10">{isCheck.length} items</p>
                                                    </>
                                                )}
                                                {(form.state == FormState.Loading) && <ProgressCard progressStatus={progressStatus} />}
                                                {(form.state == FormState.Process) && <Loader />}
                                                {(form.state == FormState.Error) && <EmptyState message={form.message ?? 'There is an error'} />}
                                                <div className="-mx-3 flex flex-wrap gap-y-4"><div className="w-full px-3 2xsm:w-1/2">
                                                    <button className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1" onClick={handleClose}>Cancel</button>
                                                </div>
                                                    <div className="w-full px-3 2xsm:w-1/2">
                                                        <button className="block w-full rounded border border-meta-1 bg-meta-1 p-3 text-center font-medium text-white transition hover:bg-opacity-90" onClick={deleteEntry}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Name
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <CheckboxSelectAll type="checkbox" name="selectAll" id="selectAll" handleClick={handleSelectAll} isChecked={isCheckAll} isChecks={isCheck} totalItems={data?.meta?.total_items} />
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <div className="relative">
                                        <button className="absolute right-1 top-1/2 -translate-y-1/2" onClick={resetQuery}>
                                            {search.length > 0 &&
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    className="h-5 w-5 text-gray-400 dark:text-gray-300"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18 18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            }
                                            {search.length <= 0 &&
                                                <svg
                                                    className="h-5 w-5 text-gray-400 dark:text-gray-300"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    />
                                                </svg>

                                            }
                                        </button>
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            placeholder="Search tag name"
                                            name="name"
                                            onChange={handleChange}
                                            className="block w-full rounded border-2 border-stroke bg-transparent py-3 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                </td>
                                <td className="border-b border-[#eee] items-center justify-center dark:border-strokedark">
                                    <button className="block w-full rounded border border-meta-1 p-3 bg-meta-1 text-center font-medium text-white transition hover:bg-opacity-90" onClick={resetQuery}>Reset</button>
                                </td>
                            </tr>
                            {isLoading && <tr>
                                <td colSpan={2} className="items-center justify-center">
                                    <Loader />
                                </td>
                            </tr>}
                            {(error || blogData.length === 0) && <tr>
                                <td colSpan={2} className="items-center justify-center">
                                    <EmptyState message={data?.message ? data?.message : 'No Data'} />
                                </td>
                            </tr>}
                            {blogData?.map((entry, index) => (
                                <TagItem key={index} entry={entry} handleClick={handleClick} isCheck={isCheck} />
                            ))}
                        </tbody>
                    </table>
                    <PaginationDefault
                        page={page}
                        limit={limit}
                        itemCount={data?.meta?.total_items ?? 0}
                        setPage={setPage}
                        setLimit={setLimit}
                    />
                </div>
            </div>
        </>
    )
}