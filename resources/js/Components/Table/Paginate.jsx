import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Paginate({ data }) {
    const [currentPage, setCurrentPage] = useState(data.current_page);

    const movePage = () => {
        if (currentPage >= 1 && currentPage <= data.last_page)
            router.get(
                data?.first_page_url.replace("page=1", `page=${currentPage}`)
            );
    };

    return (
        <nav
            className="flex flex-col items-center justify-between pt-4 sm:flex-row"
            aria-label="Table navigation"
        >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                    {`${data.from}-${data.to}`}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                    {data.total}
                </span>
            </span>
            <div className="my-3 flex">
                {data.prev_page_url && (
                    <Link
                        href={data.prev_page_url}
                        className="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <span className="sr-only">Previous</span>
                        <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </Link>
                )}
                <div className="mx-3 inline-flex items-center space-x-2">
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                movePage();
                            }
                        }}
                        onBlur={() => {
                            movePage();
                        }}
                        value={currentPage}
                        onChange={(e) => {
                            setCurrentPage(e.target.value);
                        }}
                        type="number"
                        className="w-10 border-b-2 border-t-0 border-r-0 border-l-0 p-0 text-center outline-none focus:border-b-2 focus:shadow-none focus:outline-none focus:ring-0"
                    />
                    <span className="text-xl">/</span>
                    <span className="text-base font-thin">
                        {data.last_page}
                    </span>
                </div>
                {data.next_page_url && (
                    <Link
                        href={data.next_page_url}
                        className="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <span className="sr-only">Next</span>
                        <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </Link>
                )}
            </div>
        </nav>
    );
}
