'use client'
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { Suspense, useState } from "react"

import { useSWRConfig } from "swr"
import { Blog, Tag } from "@/commons/types/blog";
import Image from "next/image";
import Link from "next/link";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import CheckboxDefault from "@/components/Checkboxes/CheckboxDefault";
import { Draft } from "./BlogListTable";
import { useAuthStore } from "@/lib/store/auth";
import { Role } from "@/types/roles";

interface BlogItemProps {
    entry: Blog,
    handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isCheck: number[],
    isDraft: Draft[],
    setIsDraft: (draft: Draft[]) => void,
}

export default function BlogItem({ entry, handleClick, isCheck, isDraft, setIsDraft }: BlogItemProps) {

    const { mutate } = useSWRConfig()

    const [show, setShow] = useState(false);
    const [draft, setDraft] = useState(entry.draft.toString());

    const { user } = useAuthStore()

    const handleShow = () => {
        setShow(true);
    }
    const handleClose = () => {
        setShow(false);
    }

    const handleDraft = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        const { id, value } = e.target

        setDraft(value);

        setIsDraft([{ ...isDraft, id: parseInt(id), draft: value }]);
    }

    const API_URL_BLOG = `${process.env.NEXT_PUBLIC_API_URL}blog`
    const API_URL_BLOG_ACTION = `${process.env.NEXT_PUBLIC_API_URL}blog/${entry.id}`

    const deleteEntry = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        await fetch(API_URL_BLOG_ACTION, {
            method: "DELETE",
        })

        mutate(API_URL_BLOG)

        handleClose()
    }

    return (
        <>
            <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex items-center">
                        <CheckboxDefault key={entry.id} type="checkbox" name={entry.title} id={entry.id.toString()} handleClick={handleClick} isChecked={isCheck.includes(entry.id)} />
                    </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                        {entry.title}
                    </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                        {entry.summary}
                    </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <Image
                        src={entry.image}
                        width={70}
                        height={70}
                        alt={`article image ${entry.image_alt}`}
                        className="h-45 w-45 rounded-md dark:shadow-gray-800"
                        placeholder="blur"
                        blurDataURL="images/loader/placeholder.png"
                    />
                </td>
                {(user?.user_admin && user?.user_admin.user_admin_role.name == Role.SUPER_ADMIN) && <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <div>
                        <div className="relative z-20 bg-white dark:bg-form-input">
                            <select value={draft} onChange={handleDraft} name={entry.draft.toString()} id={entry.id.toString()} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input items-center justify-center text-center">
                                <option value="false" >Draft</option>
                                <option value="true" >Publish</option>
                            </select>
                            <span className={`absolute top-1/2 left-2 z-30 -translate-y-1/2`}>
                                {draft == "false" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>) :
                                    (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                        <g opacity="0.8">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z" fill="#637381" ></path>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z" fill="#637381" ></path>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z" fill="#637381" ></path>
                                        </g>
                                    </svg>)
                                }
                            </span>
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
                    {entry.tags && entry.tags?.slice(0, 4).map((e: Tag, i: number) => {
                        return i < 3 ? <button key={i} className="inline-flex rounded-full bg-[#EFEFEF] px-3 py-1 text-sm font-medium text-[#212B36] hover:bg-opacity-90">{e.name}</button>
                            : <button key={i} className="inline-flex rounded-full bg-[#EFEFEF] px-3 py-1 text-sm font-medium text-[#212B36] hover:bg-opacity-90">{`${entry.tags && entry.tags?.length - i}+ more`}</button>
                    })}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                        <Link href={`/blog/show/${entry.id}`} className="hover:text-primary">
                            <Suspense>
                                <FiEye />
                            </Suspense>
                        </Link>
                        <Link href={`/blog/edit/${entry.id}`} className="hover:text-primary">
                            <Suspense>
                                <FiEdit />
                            </Suspense>
                        </Link>
                        <div>
                            <button className="hover:text-primary" onClick={handleShow}>
                                <Suspense>
                                    <FiTrash />
                                </Suspense>
                            </button>
                            <div className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${show ? 'block' : 'hidden'}`}>
                                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                                    <span className="mx-auto inline-block"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
                                        <path d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </span>
                                    <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">Warning</h3>
                                    <p className="mb-10">Are you sure want to delete this?</p>
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
                    </div>
                </td>
            </tr>
        </>
    )
}