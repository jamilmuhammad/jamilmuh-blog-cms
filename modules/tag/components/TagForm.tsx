'use client'
/* eslint-disable @next/next/no-html-link-for-pages */
import { useState, useEffect, useMemo, Suspense, useRef } from "react"
import useSWR, { useSWRConfig } from "swr"

import Link from "next/link"

import { usePathname, useRouter } from "next/navigation"

import { fetcher } from "@/services/fetcher"
import { Tag } from "@/commons/types/blog"
import EmptyState from "@/components/common/elements/EmptyState"
import Loader from "@/components/common/Loader"
import React from 'react';

import { toast } from 'react-toastify';
import { TTagSchema, TagSchema } from "../types/tag"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface FormDefaultProps {
  state?: string | null,
  message?: string | null
}

const FormDefault: FormDefaultProps = {
  state: '',
  message: ''
}

export default function TagForm() {
  const router = useRouter()

  const pathNameChecker = (url: string) => {

    // Define a regular expression pattern to match the URL
    const pattern: RegExp = /^\/tag\/(show|edit)\/(\d+)|\/tag\/create$/;

    // Use the regex pattern to test the URL
    const match: RegExpMatchArray | null = url.match(pattern);

    if (match) {
      // const action: string | undefined = match[1]; // "show", "edit", or undefined
      // const id: number | undefined = parseInt(match[2], 10); // The number or undefined
      // return { action, id }

      const parts = url.split('/')

      if (parts[1] === 'tag') {
        // The URL starts with "/tag"
        const parsedAction = parts[2]; // "create," "show," or "edit"
        setAction(parsedAction);

        if ((parsedAction === 'show' || parsedAction === 'edit') && parts[3]) {
          const parsedId = parseInt(parts[3], 10); // The number or undefined
          setId(isNaN(parsedId) ? undefined : parsedId);
        } else {
          setId(undefined);
        }
      } else {
        // Handle cases when the URL doesn't start with "/tag"
        setAction(undefined);
        setId(undefined);
      }
    } else {
      <EmptyState message={'No Data'} />
      return null
    }
  }

  const pathname = usePathname()

  const [action, setAction] = useState<string | undefined>(undefined);
  const [id, setId] = useState<number | undefined>(undefined);

  useMemo(() => {
    if (pathname) {
      pathNameChecker(pathname) || {};
    }
  }, [pathname])

  const [isShow, setIsShow] = useState(false);

  useMemo(() => {
    if (action == 'show') {
      setIsShow(true)
    }
  }, [isShow])

  const { mutate } = useSWRConfig()
  const [form, setForm] = useState(FormDefault)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const API_URL_TAG = `${process.env.NEXT_PUBLIC_API_URL}tag`
  const API_URL_TAG_ACTION = `${process.env.NEXT_PUBLIC_API_URL}tag/${id}`

  const shouldFetchTag = action != 'create'; // Only fetch when action is "create"

  const { data: responseDataTag, error: responseErrorTag } = useSWR(
    shouldFetchTag ? API_URL_TAG_ACTION : null,
    fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.status === 404) return
      if (retryCount >= 10) return

      setTimeout(() => revalidate({ retryCount }), 5000)
    },
    revalidateOnFocus: false
  }
  );

  const { data: dataTag } = responseDataTag || {}
  const { response: errorTag } = responseErrorTag || {}

  const {
    register,
    trigger,
    formState: { errors },
    reset,
    setValue
  } = useForm<TTagSchema>({
    defaultValues: { name: '' },
    resolver: zodResolver(TagSchema),
  });

  const [formData, setFormData] = useState(dataTag)

  useEffect(() => {
    if (dataTag) {
      setFormData({ ...dataTag })
    }
  }, [dataTag])

  useEffect(() => {
    if (formData) {
      setValue('name', formData.name);
    }
  }, [formData, setValue]);

  if (shouldFetchTag && errorTag) {
    return <EmptyState message={errorTag?.data?.message ? errorTag?.data?.message : 'No Data'} />
  }

  if (shouldFetchTag && !dataTag) {
    return <Loader />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: Tag) => ({
      ...prevState,
      [name]: value,
    })
    );

  };

  const handleFormChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setForm({ state: "" })
    // Trigger validation and capture the result
    const result = await trigger();

    // If the form is valid, reset it and handle the show
    if (result) {
      reset();
      handleShow();
    } else {
      console.log(errors);
    }
  }

  const leaveEntry = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setForm({ state: "loading" })

    const payload = {
      ...formData,
    }

    setForm({ state: "process" })

    let url = API_URL_TAG
    let method = 'POST'

    if (action != 'create' && id) {
      url = API_URL_TAG_ACTION
      method = 'PATCH'
    }

    const res = await fetch(url, {
      body: JSON.stringify({
        ...payload
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: method,
    })

    const { error, message } = await res.json()

    if (error) {
      setForm({
        state: "error",
        message: message,
      })
      toast.error(message);
    }

    mutate(API_URL_TAG)
    setForm({
      state: "success",
      message: `Successfully, manage tag!`,
    })

    toast.success('Successfully, manage tag!');

    router.push('/tag')
  }

  return (
    <>
      <div className="rounded-sm border border-stroke px-5 pt-6 pb-2.5 shadow-default dark:border-primary-color-dark-100 sm:px-7.5 xl:pb-1">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Tag Form
          </h3>
        </div>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Name tag <span className="text-meta-1">*</span>
              </label>
              <input
                {...register("name", { required: false })}
                id="name"
                type="text"
                readOnly={isShow}
                disabled={isShow}
                placeholder="Enter your name tag"
                value={formData?.name ?? ''}
                name="name"
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name?.message && <span>{`${errors.name?.message}`}</span>}
            </div>

            <div className="flex flex-row-reverse gap-6 py-4">
              {!isShow &&
                <button type="button" className="flex justify-center rounded bg-graydark p-3 font-medium text-white" onClick={handleFormChange}>
                  Confirm
                </button>}
              <Link href={`/tag`} className="flex justify-center rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-success hover:bg-success hover:text-dark dark:border-white dark:bg-meta-4 dark:text-white dark:hover:border-dark dark:hover:bg-opacity-90">
                Cancel
              </Link>
              <div className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${show ? '' : 'hidden'}`}>
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                  <Suspense>
                    {form.state == '' && (
                      <>
                        <span className="mx-auto inline-block"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
                          <path d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </span>
                        <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">Warning</h3>
                        <p className="mb-10">Are you sure want to process this?</p>
                      </>
                    )}
                    {form.state == 'process' && <Loader />}
                    {form.state == 'error' && <EmptyState message={form.message ?? 'There is an error'} />}
                  </Suspense>
                  <div className="-mx-3 flex flex-wrap gap-y-4"><div className="w-full px-3 2xsm:w-1/2">
                    <button type="button" className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-success hover:bg-success hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-success dark:hover:bg-success" onClick={handleClose}>Cancel</button>
                  </div>
                    <div className="w-full px-3 2xsm:w-1/2">
                      <button className="block w-full rounded border border-success bg-success p-3 text-center font-medium text-white transition hover:bg-opacity-90" onClick={leaveEntry}>Confirm</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

    </>
  )
}
