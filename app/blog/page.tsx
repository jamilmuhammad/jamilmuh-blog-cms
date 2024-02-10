import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";
import BlogListTable from "@/modules/blog";
import Link from "next/link";

const BlogManagement = () => {

  return (
    <>
      <Breadcrumb pageName="Tables" />

      {/* <div className="flex flex-col gap-10">
      </div> */}
      <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap justify-center gap-5">
          <div className="w-full">
            <Link href={'/blog/create'} className="w-1/4 block w-full rounded border border-graydark bg-graydark p-3 text-center font-medium text-white transition hover:bg-opacity-90">Create</Link>
          </div>
          <BlogListTable />
          {/* <div>
            <button className="rounded-md bg-primary py-3 px-9 font-medium text-white" onClick={() => setShow(true)}>Modal 1</button>
            <div className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${show ? '' : 'hidden'}`}>
              <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">Your Message Sent Successfully</h3><span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                <p className="mb-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since</p>
                <div className="-mx-3 flex flex-wrap gap-y-4">
                  <div className="w-full px-3 2xsm:w-1/2">
                    <button className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1" onClick={() => setShow(false)}>Cancel</button>
                  </div>
                  <div className="w-full px-3 2xsm:w-1/2">
                    <button className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90" onClick={() => setShow(false)}>View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div>
            <button className="rounded-md bg-primary py-3 px-9 font-medium text-white">Modal 2</button>
            <div className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 hidden">
              <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                <span className="mx-auto inline-block"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
                  <path d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg></span>
                <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">Deactivate Your Account</h3><p className="mb-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum been.</p>
                <div className="-mx-3 flex flex-wrap gap-y-4"><div className="w-full px-3 2xsm:w-1/2">
                  <button className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">Cancel</button>
                </div>
                  <div className="w-full px-3 2xsm:w-1/2">
                    <button className="block w-full rounded border border-meta-1 bg-meta-1 p-3 text-center font-medium text-white transition hover:bg-opacity-90">Deactivate</button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div><button className="rounded-md bg-primary py-3 px-9 font-medium text-white">Modal 3</button><div className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 hidden"><div className="relative w-full max-w-142.5 rounded-lg bg-primary py-12 px-8 text-center md:py-15 md:px-17.5"><span className="mx-auto inline-block"><svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.1" width="78" height="78" rx="37" fill="white"></rect><path d="M39.6114 16.8999C27.0342 16.8999 16.8984 27.0357 16.8984 39.6129C16.8984 52.1901 27.0342 62.3999 39.6114 62.3999C52.1887 62.3999 62.3984 52.1901 62.3984 39.6129C62.3984 27.0357 52.1887 16.8999 39.6114 16.8999ZM39.6114 59.8105C28.5139 59.8105 19.4879 50.7105 19.4879 39.6129C19.4879 28.5154 28.5139 19.4893 39.6114 19.4893C50.709 19.4893 59.809 28.5154 59.809 39.6129C59.809 50.7105 50.709 59.8105 39.6114 59.8105Z" fill="white"></path><path d="M49.6748 42.2023H29.5513C28.8854 42.2023 28.2935 42.4982 27.8496 43.0161C27.4797 43.534 27.2578 44.1258 27.4057 44.7917C28.5155 50.5624 33.6204 54.8535 39.613 54.8535C45.6057 54.8535 50.7106 50.6364 51.8204 44.7917C51.9683 44.1998 51.7464 43.534 51.3765 43.0161C51.0065 42.4982 50.3407 42.2023 49.6748 42.2023ZM39.613 52.2641C35.1 52.2641 31.1789 49.1567 30.0691 44.7917H49.2309C48.0472 49.1567 44.126 52.2641 39.613 52.2641Z" fill="white"></path><path d="M30.807 35.6919C32.4346 35.6919 33.7664 34.3602 33.7664 32.7325C33.7664 31.1049 32.4346 29.7732 30.807 29.7732C29.1794 29.7732 27.8477 31.1049 27.8477 32.7325C27.9216 34.4342 29.2533 35.6919 30.807 35.6919Z" fill="white"></path><path d="M48.4164 35.7659C50.0508 35.7659 51.3757 34.4409 51.3757 32.8065C51.3757 31.1721 50.0508 29.8472 48.4164 29.8472C46.782 29.8472 45.457 31.1721 45.457 32.8065C45.457 34.4409 46.782 35.7659 48.4164 35.7659Z" fill="white"></path></svg></span><h3 className="mt-5.5 pb-2 text-xl font-bold text-white sm:text-4xl">Congratulations!</h3><span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span><p className="mb-7.5 text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum been.</p><a href="#" className="inline-block rounded border border-white py-3 px-12.5 text-center font-medium text-white transition hover:bg-white hover:text-primary">Know More</a><button className="absolute top-6 right-6 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-primary"><svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z" className="fill-current stroke-current"></path></svg></button></div></div></div> */}
        </div>
      </div>
    </>
  );
};

export default BlogManagement;
