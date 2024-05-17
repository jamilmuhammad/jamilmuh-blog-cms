import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import TagListTable from "@/modules/tag";
import Link from "next/link";
import { Suspense } from "react";

const BlogManagement = () => {

  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap justify-center gap-5">
          <div className="w-full items-start justify-start">
            <Link href={'/tag/create'} className="w-1/4 block rounded border border-graydark bg-graydark p-3 text-center font-medium text-white transition hover:bg-opacity-90">Create</Link>
          </div>
          <Suspense fallback={<Loader />}>
            <TagListTable />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default BlogManagement;
