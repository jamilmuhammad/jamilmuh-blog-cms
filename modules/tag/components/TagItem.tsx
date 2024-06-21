'use client'
/* eslint-disable @next/next/no-html-link-for-pages */
import { Suspense, useState } from "react"

import { useSWRConfig } from "swr"
import { Tag } from "@/commons/types/blog";
import Link from "next/link";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import CheckboxDefault from "@/components/Checkboxes/CheckboxDefault";
import Modal from "@/components/Modal/ModalDefault";

interface TagItemProps {
    entry: Tag,
    handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isCheck: number[]
}

export default function TagItem({ entry, handleClick, isCheck }: TagItemProps) {

    const { mutate } = useSWRConfig()

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    }
    const handleClose = () => {
        setShow(false);
    }

    const API_URL_TAG = `${process.env.NEXT_PUBLIC_API_URL}tag`
    const API_URL_TAG_ACTION = `${process.env.NEXT_PUBLIC_API_URL}tag/${entry.id}`

    const deleteEntry = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        await fetch(`${API_URL_TAG_ACTION}`, {
            method: "DELETE",
        })

        mutate(`${API_URL_TAG}`)

        handleClose()
    }

    return (
        <>
            <tr>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex items-center">
                        <CheckboxDefault key={entry.id} type="checkbox" name={entry.name} id={entry.id.toString()} handleClick={handleClick} isChecked={isCheck.includes(entry.id)} />
                    </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                        {entry.name}
                    </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                        <Link href={`/tag/show/${entry.id}`} className="hover:text-primary">
                            <Suspense>
                                <FiEye />
                            </Suspense>
                        </Link>
                        <Link href={`/tag/edit/${entry.id}`} className="hover:text-primary">
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
                            <Modal show={show}>
                                <span className="mx-auto inline-block"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
                                    <path d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                </span>
                                <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">Warning</h3>
                                <p className="mb-10">Are you sure want to delete this?</p>
                                <div className="-mx-3 flex gap-y-4"><div className="w-full px-3 2xsm:w-1/2">
                                    <button className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1" onClick={handleClose}>Cancel</button>
                                </div>
                                    <div className="w-full px-3 2xsm:w-1/2">
                                        <button className="block w-full rounded border border-meta-1 bg-meta-1 p-3 text-center font-medium text-white transition hover:bg-opacity-90" onClick={deleteEntry}>Delete</button>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}