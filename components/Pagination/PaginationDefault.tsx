// components/Pagination.tsx
import usePagination from "@lucasmogari/react-pagination";
import cn from "classnames";
import React, { memo, PropsWithChildren } from "react";

type Props = {
  page: number;
  itemCount: number;
  limit: number;
  setPage: (page: number) => void,
  setLimit: (limit: number) => void,
};

const PaginationDefault = ({ page, itemCount, limit, setPage, setLimit }: Props) => {
  // use the usePagination hook
  // getPageItem - function that returns the type of page based on the index.
  // size - the number of pages
  const { getPageItem, totalPages } = usePagination({
    totalItems: itemCount,
    page: page,
    itemsPerPage: limit,
    maxPageItems: 7,
  });

  const firstPage = 1;
  // calculate the next page
  const nextPage = Math.min(page + 1, totalPages);
  // const nextPage = Math.min(Math.ceil(itemCount / limit), page + 1);
  // calculate the previous page
  const prevPage = Math.max(page - 1, firstPage);
  // create a new array based on the total pages
  const arr = new Array(totalPages + 2);

  return (
    <div className="flex gap-2 items-center">
      {[...arr].map((_, i) => {
        // getPageItem function returns the type of page based on the index.
        // it also automatically calculates if the page is disabled.
        const { page, disabled, current } = getPageItem(i);
        
        if (page === "previous") {
          return (
            <PaginationLink page={prevPage} limit={limit} disabled={disabled} key={i} setPage={setPage} setLimit={setLimit}>
              <span aria-hidden="true">&laquo;</span>{` previous`}
            </PaginationLink>
          );
        }

        if (page === "gap") {
          return <span key={`${page}-${i}`}>...</span>;
        }

        if (page === "next") {
          return (
            <PaginationLink page={nextPage} limit={limit} disabled={disabled} key={i} setPage={setPage} setLimit={setLimit}>
              {`next`} <span aria-hidden="true">&raquo;</span>
            </PaginationLink>
          );
        }

        return (
          <PaginationLink active={current} limit={limit} key={i} page={page!} setPage={setPage} setLimit={setLimit}>
            {page}
          </PaginationLink>
        );
      })}
    </div>
  );
};

type PaginationLinkProps = {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  active?: boolean;
  disabled?: boolean;
} & PropsWithChildren;

function PaginationLink({ page, limit, setPage, setLimit, children, ...props }: PaginationLinkProps) {

  // we use existing data from router query, we just modify the page.
  const setUrl = () => {
    setPage(page)
    setLimit(limit)
  };

  return (
    <button
      // only use the query for the url, it will only modify the query, won't modify the route.
      onClick={() => setUrl()}
      // toggle the appropriate classes based on active, disabled states.
      className={cn({
        "relative block rounded bg-transparent px-3 py-1.5 text-sm transition duration-300": true,
        "font-medium bg-blue-200 text-blue-700 focus:outline-none dark:bg-slate-900 dark:text-blue-500": props.active,
        "hover:bg-neutral-100 focus:bg-neutral-100 focus:text-blue-700 focus:outline-none active:bg-neutral-100 active:text-blue-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:focus:text-blue-500 dark:active:bg-neutral-700 dark:active:text-blue-500": !props.active,
        "pointer-events-none text-surface/50 dark:text-neutral-400": props.disabled,
      })}
    >
      {children}
      {props.active && <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">(current)</span>}
    </button>
  );
}
export default memo(PaginationDefault);