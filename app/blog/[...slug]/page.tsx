// import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import BlogForm from "@/modules/blog/components/BlogForm";
import { Suspense } from "react";

const BlogDetail = () => {
  return (
    <>
      <Breadcrumb pageName="Blog Detail" />

      <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap justify-center gap-5">
          <Suspense fallback={<Loader />}>
            <BlogForm action={'show'} id={Number(1)} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;