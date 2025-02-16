import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import TagForm from "@/modules/tag/components/TagForm";
import { Suspense } from "react";

const TagDetail = () => {
  return (
    <>
      <Breadcrumb pageName="Tag Detail" />

      <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap justify-center gap-5">
          <Suspense fallback={<Loader />}>
            <TagForm />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default TagDetail;