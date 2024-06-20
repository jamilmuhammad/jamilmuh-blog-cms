"use client";

import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  imagePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertTable,
  ListsToggle,
  Separator,
  ButtonOrDropdownButton,
  linkDialogPlugin,
  linkPlugin,
  BlockTypeSelect,
  InsertCodeBlock,
  InsertImage,
} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';
import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { imageUploadHandler } from "@/lib"

interface MDXEditorProps {
  markdown: string;
  onChange?: (markdown: string) => void;
  handleMention: (markdown: string) => void | undefined;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

type User = {
  path: string
}

interface ItemsData {
  value: string;
  label: string;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<MDXEditorProps> = ({ markdown, onChange, editorRef, handleMention }) => {

  const [datas, setDatas] = useState([{ value: '', label: '' }])

  const { data: responseData, error: responseErrorTags } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}user/username/path`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.status === 404) return
      if (retryCount >= 10) return

      setTimeout(() => revalidate({ retryCount }), 5000)
    },
    revalidateOnFocus: false
  })

  useEffect(() => {
    if (responseData?.data) {
      const transformedData = responseData.data.map((item: User) => ({
        value: item.path,
        label: `@${item.path}`
      }));
      setDatas(transformedData);

    }
  }, [responseData?.data])

  return (
    <MDXEditor
      onChange={onChange}
      ref={editorRef}
      markdown={markdown}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {' '}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <BlockTypeSelect />
              <CodeToggle />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertCodeBlock />
              <Separator />
              {datas.length > 0 && <ButtonOrDropdownButton<string>
                title="Format"
                onChoose={handleMention}
                items={datas}
              ><i className="text-black dark:text-white">@</i>
              </ButtonOrDropdownButton>}
            </>
          )
        }),
        linkPlugin(),
        linkDialogPlugin({
          linkAutocompleteSuggestions: responseData?.data.length > 0 && responseData?.data.map((item: User) => (`https://jamilmuhammad-blog.vercel.app/about/${item?.path}`)),
        }),
        imagePlugin({ imageUploadHandler }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),]}
    />
  );
};

export default Editor;