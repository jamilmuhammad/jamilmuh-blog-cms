// import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BlogForm from "@/modules/blog/components/BlogForm";

const BlogDetail = () => {
  // const router = useRouter();

  // const { page } = router.query;

  // const [action, id] = Array.isArray(page) ? page : [];

  return (
    <>
      <Breadcrumb pageName="Blog Detail" />

      <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap justify-center gap-5">
          <BlogForm action={'show'} id={Number(1)} />
        </div>
      </div>
    </>
  );
};

export default BlogDetail;