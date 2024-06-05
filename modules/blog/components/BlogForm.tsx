'use client'
/* eslint-disable @next/next/no-html-link-for-pages */
import { useState, useEffect, useMemo } from "react"
import useSWR, { useSWRConfig } from "swr"

import Link from "next/link"

import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import "@uiw/react-md-editor/markdown-editor.css"

import { MultiValue } from "react-select";
import CreatableSelect from 'react-select/creatable';

import { usePathname, useRouter } from "next/navigation"

import MDEditor from "@uiw/react-md-editor";
import { fetcher } from "@/services/fetcher"
import { Blog, Tag } from "@/commons/types/blog"
import EmptyState from "@/components/common/elements/EmptyState"
import Loader from "@/components/common/Loader"
import React from 'react';
import { ActionMeta } from 'react-select';
import CheckboxStatus from "@/components/Checkboxes/CheckboxStatus"

import useUpload from "@/hooks/use-upload.hook"
import { ButtonFile, Dropzone, InputLink, PreviewImage } from "./Uploaders"
import { uploadFile } from "@/lib"
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form"
import { BlogSchema, TBlogSchema } from "../types/blog"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProgressCard } from "@/components/common/elements/ProgressCard"
import { Role } from "@/types/roles"
import { useAuthStore } from "@/lib/store/auth"

interface OptionType {
  value: string | number;
  label: string;
}
interface FormDefaultProps {
  state?: string | null,
  message?: string | null
}

const FormDefault: FormDefaultProps = {
  state: '',
  message: ''
}

export default function BlogForm() {
  const router = useRouter()

  const pathNameChecker = (url: string) => {

    // Define a regular expression pattern to match the URL
    const pattern: RegExp = /^\/blog\/(show|edit)\/(\d+)|\/blog\/create$/;

    // Use the regex pattern to test the URL
    const match: RegExpMatchArray | null = url.match(pattern);

    if (match) {
      const parts = url.split('/')

      if (parts[1] === 'blog') {
        // The URL starts with "/blog"
        const parsedAction = parts[2]; // "create," "show," or "edit"
        setAction(parsedAction);

        if ((parsedAction === 'show' || parsedAction === 'edit') && parts[3]) {
          const parsedId = parseInt(parts[3], 10); // The number or undefined
          setId(isNaN(parsedId) ? undefined : parsedId);
        } else {
          setId(undefined);
        }
      } else {
        // Handle cases when the URL doesn't start with "/blog"
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
  }, [action])
  
  const { user } = useAuthStore()

  const {
    register,
    trigger,
    formState: { errors },
    reset,
    setValue
  } = useForm<TBlogSchema>({
    resolver: zodResolver(BlogSchema), // Apply the zodResolver
  });

  const { mutate } = useSWRConfig()
  const [form, setForm] = useState(FormDefault)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isLoading, setIsLoading] = useState(false);

  const API_URL_BLOG = `${process.env.NEXT_PUBLIC_API_URL}article`
  const API_URL_BLOG_ACTION = `${process.env.NEXT_PUBLIC_API_URL}article/${id}`
  const API_URL_TAG = `${process.env.NEXT_PUBLIC_API_URL}tag`

  const shouldFetchArticle = action != 'create'; // Only fetch when action is "create"

  const { data: responseDataArticle, error: responseErrorArticle } = useSWR(
    shouldFetchArticle ? API_URL_BLOG_ACTION : null,
    fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.status === 404) return
      if (retryCount >= 10) return

      setTimeout(() => revalidate({ retryCount }), 5000)
    },
    revalidateOnFocus: false
  }
  );

  const { data: dataArticle } = responseDataArticle || {}
  const { response: errorArticle } = responseErrorArticle || {}

  const { data: responseDataTags, error: responseErrorTags } = useSWR(`${API_URL_TAG}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.status === 404) return
      if (retryCount >= 10) return

      setTimeout(() => revalidate({ retryCount }), 5000)
    },
    revalidateOnFocus: false
  })
  const { data: dataTags } = responseDataTags || {}
  const { response: errorTags } = responseErrorTags || {}

  const [formData, setFormData] = useState(dataArticle)
  const [markdown, setMarkdown] = useState(dataArticle?.markdown ?? null)
  const [isChecked, setIsChecked] = useState(dataArticle?.draft ?? false)

  const u = useUpload();

  useEffect(() => {
    if (dataArticle) {
      setFormData({ ...dataArticle, tags: dataArticle?.tags.map((tag: Tag) => tag?.id) })
      setMarkdown(dataArticle?.markdown)
      setIsChecked(dataArticle?.draft)
      u.setFiles(dataArticle?.image)
    }
  }, [dataArticle])

  useEffect(() => {
    if (formData) {
      setValue('title', formData.title);
      setValue('date', formData.date);
      setValue('summary', formData.summary);
      setValue('image', formData.image);
      setValue('image_alt', formData.image_alt);
    }
  }, [formData, setValue]);

  useEffect(() => {
    trigger();
  }, [formData]);

  const detailArticleTags = useMemo(() => {
    if (dataArticle?.tags && Array.isArray(dataArticle?.tags)) {
      return dataArticle?.tags.map((tag: Tag) => { return { value: tag.id, label: tag.name } });
    }
    return [];
  }, [dataArticle?.tags]);

  const listTags = useMemo(() => {
    if (dataTags && Array.isArray(dataTags)) {
      return dataTags.map((tag: Tag) => { return { value: tag.id, label: tag.name } });
    }
    return [];
  }, [dataTags]);

  if (shouldFetchArticle && errorArticle) {
    return <EmptyState message={errorArticle?.data?.message ? errorArticle?.data?.message : 'No Data'} />
  }

  if (shouldFetchArticle && !dataArticle) {
    return <Loader />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: Blog) => ({
      ...prevState,
      [name]: value,
    })
    );

  };

  const handleChangeInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(e)
    u.setFiles(value);
  };

  const handleTagsChange = async (
    selected: MultiValue<OptionType>,
    selectAction: ActionMeta<OptionType>
  ) => {
    const { action } = selectAction;
    if (action === "clear") {
      setFormData((prevData: Blog) => ({ ...prevData, tags: [] }))
    } else if (action === "select-option") {
      if (selected) {
        setFormData((prevData: Blog) => ({ ...prevData, tags: selected.map((tag: OptionType) => tag.value as string) }))
      }
    } else if (action === "remove-value") {
      if (selected) {
        setFormData((prevData: Blog) => ({ ...prevData, tags: selected.map((tag: OptionType) => tag.value as string) }))
      }
    }
  };

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      const res = await fetch(API_URL_TAG, {
        body: JSON.stringify({
          name: inputValue
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
      })

      const { data, error, message } = await res.json()

      if (error) {
        toast.error(message);
        setIsLoading(false);
      }

      listTags.push({ value: data.id, label: data.name });
      detailArticleTags.push({ value: data.id, label: data.name });
      setIsLoading(false);
    }, 1000);
  };

  const filterColors = (inputValue: string) => {
    return listTags.filter(({ label }) =>
      label.toLowerCase().includes(inputValue.toLowerCase())
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
      markdown: markdown,
      draft: isChecked,
    }


    if (u.formatImage) {
      const data = await uploadFile({
        formData: u.formatImage,
        onUploadProgress(progress) {
          u.setProgressStatus(progress);
        },
      });

      if (data) {
        const { secure_url } = data
        payload.image = !secure_url ? 'https://i.pinimg.com/564x/76/80/4e/76804ed4e8c23744eb0b9f34aa60cd2b.jpg' : secure_url
      }
    }

    if (payload.image) {
      payload.image = payload.image.replace(/\s/g, "");
    }

    setForm({ state: "process" })

    let url = API_URL_BLOG
    let method = 'POST'

    if (action != 'create' && id) {
      url = API_URL_BLOG_ACTION
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

    mutate(API_URL_BLOG)
    setForm({
      state: "success",
      message: `Successfully, manage article!`,
    })

    toast.success('Successfully, manage article!');

    router.push('/blog')
  }

  return (
    <>
      <div className="rounded-sm border border-stroke px-5 pt-6 pb-2.5 shadow-default dark:border-primary-color-dark-100 sm:px-7.5 xl:pb-1">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Blog Form
          </h3>
        </div>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Title article
                </label>
                <input
                  {...register("title", { required: true })}
                  type="text"
                  readOnly={isShow}
                  disabled={isShow}
                  placeholder="Enter your title article"
                  value={formData?.title ?? ''}
                  name="title"
                  onChange={handleChange}
                  className="w-full rounded border-2 border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {errors.title?.message && <span>{`${errors.title?.message}`}</span>}
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Date
                </label>
                <input
                  {...register("date", { required: true })}
                  type="date"
                  name="date"
                  readOnly={isShow}
                  disabled={isShow}
                  placeholder="Enter date article"
                  value={formData?.date ?? ''}
                  onChange={handleChange}
                  className="custom-input-date custom-input-date-2 w-full rounded border-2 border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {errors.date?.message && <span>{`${errors.date?.message}`}</span>}
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Image <span className="text-meta-1">*</span>
              </label>
              {!u.isFetching && (
                <div
                  {...u.getRootProps({ className: 'dropzone' })}
                  className='w-full sm:w-[402px] h-[469px] p-8 bg-slate-50 sm:bg-white rounded-xl shadow-none sm:shadow-lg sm:shadow-gray-200/80'
                >
                  <div className='w-full h-full flex gap-6 flex-col justify-evenly items-center'>
                    {formData?.image && <i className='fa-sharp fa-solid fa-circle-check text-4xl text-green-600'></i>}

                    {(u.files && !errors.image) && <PreviewImage imageUrl={u.files} removePreview={u.handleRemovePreview} isShow={isShow} />}

                    {!isShow && (
                      <>
                        <Dropzone isActive={u.isDragActive} onInputProps={u.getInputProps} />
                        <ButtonFile onClick={() => u.inputRef.current?.click()} inputRef={u.inputRef} onChange={u.onChangeFile} />
                      </>
                    )}

                    <InputLink value={u.files} name="image" register={register} errors={errors.image?.message} handleChange={handleChangeInputImage} placeholder={`Enter image url or upload file image`} />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Image alt <span className="text-meta-1">*</span>
              </label>
              <input
                {...register("image_alt")}
                type="text"
                readOnly={isShow}
                disabled={isShow}
                name="image_alt"
                value={formData?.image_alt ?? ''}
                onChange={handleChange}
                placeholder="Enter image alt article"
                className="w-full rounded border-2 border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.image_alt?.message && <span>{`${errors.image_alt?.message}`}</span>}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Summary
              </label>
              <textarea
                rows={6}
                readOnly={isShow}
                disabled={isShow}
                name="summary"
                value={formData?.summary ?? ''}
                onChange={handleChange}
                placeholder="Type summary article"
                className="w-full rounded border-2 border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ></textarea>
            </div>

            {(user?.user_admin && user?.user_admin.user_admin_role.name == Role.SUPER_ADMIN) && <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Status
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <CheckboxStatus isChecked={isChecked} setIsChecked={setIsChecked} isShow={isShow} />
              </div>
            </div>}

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Markdown
              </label>
              {isShow ? <MDEditor.Markdown source={markdown ?? ''} /> :
                <MDEditor height={200} value={markdown ?? ''} onChange={setMarkdown} />
              }
            </div>

            <div>
              <label className="mb-3 block text-black dark:text-white">
                Multiselect Dropdown
              </label>
              <div className="relative z-20 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                <CreatableSelect
                  isMulti
                  instanceId="selectTag"
                  isDisabled={isShow || isLoading}
                  name="tags"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  options={listTags}
                  value={detailArticleTags}
                  onChange={(selected: MultiValue<OptionType>, selectAction: ActionMeta<OptionType>) => handleTagsChange(selected, selectAction)}
                  onCreateOption={handleCreate}
                  placeholder="Enter tag for article"
                />
              </div>
            </div>

            <div className="flex gap-3 2xsm:gap-7 py-4">
              <Link href={`/blog`} className="flex justify-center rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-success hover:bg-success hover:text-dark dark:border-white dark:bg-meta-4 dark:text-white dark:hover:border-dark dark:hover:bg-opacity-90">
                Cancel
              </Link>
              {!isShow &&
                <button type="button" className="flex justify-center rounded bg-graydark p-3 font-medium text-white" onClick={handleFormChange}>
                  Confirm
                </button>}
              <div className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${show ? '' : 'hidden'}`}>
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
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
                  {form.state == 'loading' && <ProgressCard progressStatus={u.progressStatus} />}
                  {form.state == 'process' && <Loader />}
                  {form.state == 'error' && <EmptyState message={form.message ?? 'There is an error'} />}
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
