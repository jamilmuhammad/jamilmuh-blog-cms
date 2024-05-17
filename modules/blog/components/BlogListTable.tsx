"use client"
/* eslint-disable @next/next/no-html-link-for-pages */
import { ChangeEvent, Suspense, useEffect, useMemo, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

import { fetcher } from "@/services/fetcher"
import { Blog } from "@/commons/types/blog"
import EmptyState from "@/components/common/elements/EmptyState"
import Loader from "@/components/common/Loader"
import BlogItem from "./BlogItem"
import { toast } from "react-toastify"
import useDebounce from "@/lib/debounce.lib"
import CheckboxSelectAll from "@/components/Checkboxes/CheckboxSelectAll"
import { FiTrash } from "react-icons/fi"
import PaginationDefault from "@/components/Pagination/PaginationDefault"
import { useAuthStore } from "@/lib/store/auth"
import { Role } from "@/types/roles"
import { ProgressCard } from "@/components/common/elements/ProgressCard"

export type Draft = {
    id: number;
    draft: string;
}

export default function BlogListTable() {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const debouncedValue = useDebounce(search, 500);
    const [draft, setDraft] = useState('');

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([] as number[]);
    const [isDraft, setIsDraft] = useState([] as Draft[]);

    const [url, setUrl] = useState(`${process.env.NEXT_PUBLIC_API_URL}article?q=${search}&page=${page}&limit=${limit}&draft=${draft}`);

    const { user } = useAuthStore()

    useEffect(() => {
        if (page && limit && (debouncedValue || search.length <= 0) && (draft || draft.length <= 0)) {
            return setUrl(`${process.env.NEXT_PUBLIC_API_URL}article?q=${search}&page=${page}&limit=${limit}&draft=${draft}`)
        }
    }, [page, limit, debouncedValue, draft]);

    useMemo(() => {
        const timeoutId = setTimeout(() => {
            setSearch(input);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [input]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearch(value || '');
        setPage(1)
    };

    const handleDraft = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setDraft(value);
        setPage(1)
    };

    const resetQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
        setSearch('');
        setDraft('')
    };

    const { data, error } = useSWR(`${url}`, fetcher)

    const blogData: Blog[] = useMemo(() => {
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
            setIsCheck(blogData.map((li: Blog) => li.id as number));
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

    const API_URL_BLOG = `${process.env.NEXT_PUBLIC_API_URL}article`

    useMemo(() => {
        if (progressStatus >= 100) {
            setProgressStatus(100)
        }
    }, [progressStatus])

    const handleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setForm((prevData: FormDefaultProps) => ({ ...prevData, state: FormState.Default }))
        handleShow()
    }

    const handleDraftClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (isDraft.length > 0) {
            setIsDraft([]);
        }

        handleClose()
    }

    const deleteEntry = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const progressPart = (100 / isCheck.length)

        setForm((prevData: FormDefaultProps) => ({ ...prevData, state: FormState.Loading }))

        isCheck.map(async (e) => {
            const res = await fetch(`${API_URL_BLOG}/${e}`, {
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
            mutate(`${API_URL_BLOG}`)

            setForm((prevData: FormDefaultProps) => ({
                ...prevData,
                state: FormState.Success,
                message: `Successfully, delete tags!`,
            }))

            toast.success('Successfully, delete tags!');

            handleClose()
        }

    }

    const updateEntry = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const progressPart = (100 / isDraft.length)

        setForm((prevData: FormDefaultProps) => ({ ...prevData, state: FormState.Loading }))

        isDraft.map(async (e) => {
            const res = await fetch(`${API_URL_BLOG}/status/${e.id}`, {
                body: JSON.stringify({
                    draft: e.draft
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PATCH",
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
            mutate(`${API_URL_BLOG}`)

            setForm((prevData: FormDefaultProps) => ({
                ...prevData,
                state: FormState.Success,
                message: `Successfully, update status article!`,
            }))

            toast.success('Successfully, update status article!');

            handleDraftClose(e)
        }

    }

    return (
        <>
            <div className="w-full rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-600 text-left dark:bg-gray-300">
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white flex items-center justify-center">
                                    {(isCheck.length > 0) && (<div>
                                        <button className="hover:text-primary" onClick={handleModal}>
                                            <Suspense>
                                                <FiTrash />
                                            </Suspense>
                                        </button>
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
                                    </div>)}
                                    {(isDraft.length > 0) && (<div>
                                        <button className="hover:text-primary" onClick={handleModal}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <div className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${show ? '' : 'hidden'}`}>
                                            <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                                                {(form.state == FormState.Default) && (
                                                    <>
                                                        <span className="mx-auto inline-block"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect opacity="0.1" width="60" height="60" rx="30" fill="#FBBF24"></rect>
                                                            <path d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                        </span>
                                                        <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">Warning</h3>
                                                        <p className="mb-10">Are you sure want to update this?</p>
                                                        <p className="mb-10">{isDraft.length} items</p>
                                                    </>
                                                )}
                                                {(form.state == FormState.Loading) && <ProgressCard progressStatus={progressStatus} />}
                                                {(form.state == FormState.Process) && <Loader />}
                                                {(form.state == FormState.Error) && <EmptyState message={form.message ?? 'There is an error'} />}
                                                <div className="-mx-3 flex flex-wrap gap-y-4"><div className="w-full px-3 2xsm:w-1/2">
                                                    <button className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-warning hover:bg-warning hover:text-white dark:border-strokedark dark:bg-warning dark:text-white dark:hover:border-warning dark:hover:bg-warning" onClick={handleDraftClose}>Cancel</button>
                                                </div>
                                                    <div className="w-full px-3 2xsm:w-1/2">
                                                        <button className="block w-full rounded border border-warning bg-warning p-3 text-center font-medium text-white transition hover:bg-opacity-90" onClick={updateEntry}>Update Status</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Title
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Summary
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Image
                                </th>
                                {(user?.user_admin && user?.user_admin.user_admin_role.name == Role.SUPER_ADMIN) && (<th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Status
                                </th>)}
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Tags
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
                                    <input
                                        type="text"
                                        placeholder="Search article title"
                                        value={search}
                                        name="title"
                                        onChange={handleChange}
                                        className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                </td>
                                {(user?.user_admin && user?.user_admin.user_admin_role.name == Role.SUPER_ADMIN) && <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <div>
                                        <div className="relative z-20 bg-white dark:bg-form-input">
                                            <select value={draft} onChange={handleDraft} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                <option value="">All</option>
                                                <option value="false">Draft</option>
                                                <option value="true">Publish</option>
                                            </select>
                                            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g opacity="0.8">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                            fill="#637381"
                                                        ></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </td>}
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                </td>
                                <td className="border-b border-[#eee] items-center justify-center dark:border-strokedark">
                                    <button className="block w-full rounded border border-meta-1 p-3 bg-meta-1 text-center font-medium text-white transition hover:bg-opacity-90" onClick={resetQuery}>Reset</button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={7} className="items-center justify-center">
                                    {(error || blogData.length === 0) && <EmptyState message={data?.message ? data?.message : 'No Data'} />}
                                </td>
                            </tr>
                            {blogData?.map((entry, index) => (
                                <BlogItem key={index} entry={entry} handleClick={handleClick} isCheck={isCheck} isDraft={isDraft} setIsDraft={setIsDraft} />
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