import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, Head } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCashRegister,
    faSackDollar,
    faMoneyCheckAlt,
    faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function Welcome(props) {
    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <div className="relative sm:flex sm:justify-center sm:items-center bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <Head title="Dashboard" />
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 lg:gap-8">
                        <Link
                            href="https://laravel.com/docs"
                            className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                        >
                            <div className="w-full flex flex-col align-middle">
                                <FontAwesomeIcon
                                    icon={faCashRegister}
                                    size="5x"
                                    className="text-orange-400"
                                />

                                <h2 className="mt-6 text-xl font-extrabold text-center text-gray-900 dark:text-white">
                                    JUAL / BELI
                                </h2>
                            </div>
                        </Link>
                        <Link
                            href="https://laravel.com/docs"
                            className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                        >
                            <div className="w-full flex flex-col align-middle">
                                <FontAwesomeIcon
                                    icon={faSackDollar}
                                    size="5x"
                                    className="text-orange-400"
                                />

                                <h2 className="mt-6 text-xl font-extrabold text-center text-gray-900 dark:text-white">
                                    HUTANG / PIUTANG
                                </h2>
                            </div>
                        </Link>
                        <Link
                            href="https://laravel.com/docs"
                            className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                        >
                            <div className="w-full flex flex-col align-middle">
                                <FontAwesomeIcon
                                    icon={faMoneyCheckAlt}
                                    size="5x"
                                    className="text-orange-400"
                                />

                                <h2 className="mt-6 text-xl font-extrabold text-center text-gray-900 dark:text-white">
                                    PEMASUKAN / PENGELUARAN LAIN
                                </h2>
                            </div>
                        </Link>
                        <Link
                            href="https://laravel.com/docs"
                            className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                        >
                            <div className="w-full flex flex-col align-middle">
                                <FontAwesomeIcon
                                    icon={faChartLine}
                                    size="5x"
                                    className="text-orange-400"
                                />

                                <h2 className="mt-6 text-xl font-extrabold text-center text-gray-900 dark:text-white">
                                    LAPORAN
                                </h2>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
