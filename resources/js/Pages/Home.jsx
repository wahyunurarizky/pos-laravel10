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
import { currencyFormat } from "@/Helpers/currencyFormat";

export default function Welcome(props) {
    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <div className="bg-dots-darker dark:bg-dots-lighter relative bg-gray-100 bg-center selection:bg-red-500 selection:text-white dark:bg-gray-900 sm:flex sm:items-center sm:justify-center">
                <Head title="Beranda" />
                <div className="mx-auto max-w-7xl p-6 lg:p-8">
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:gap-8">
                        <Link
                            href={route("items.index")}
                            className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 text-gray-800 shadow-2xl shadow-gray-500/20 transition-all hover:bg-gray-800 hover:text-white focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
                        >
                            <div className="w-full text-center">
                                <FontAwesomeIcon
                                    icon={faCashRegister}
                                    size="3x"
                                    className="rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-200 to-green-500 p-4 text-gray-800"
                                />

                                <h2 className="text-md mt-6 text-center font-extrabold  dark:text-white">
                                    JUAL/BELI
                                </h2>
                            </div>
                        </Link>
                        <Link
                            href={route("debt-bond.index")}
                            className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 text-gray-800 shadow-2xl shadow-gray-500/20 transition-all hover:bg-gray-800 hover:text-white focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
                        >
                            <div className="w-full text-center">
                                <FontAwesomeIcon
                                    icon={faSackDollar}
                                    size="3x"
                                    className="rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-200 to-green-500 p-4 text-gray-800"
                                />

                                <h2 className="text-md mt-6 text-center font-extrabold  dark:text-white">
                                    HUTANG/ PIUTANG
                                </h2>
                            </div>
                        </Link>
                        <Link
                            href={route("cashflows.index")}
                            className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 text-gray-800 shadow-2xl shadow-gray-500/20 transition-all hover:bg-gray-800 hover:text-white focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
                        >
                            <div className=" w-full text-center">
                                <FontAwesomeIcon
                                    icon={faMoneyCheckAlt}
                                    size="3x"
                                    className="rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-200 to-green-500 p-4 text-gray-800"
                                />

                                <h2 className="mt-6 text-center text-sm font-extrabold tracking-tighter">
                                    PEMASUKAN/ PENGELUARAN
                                </h2>
                            </div>
                        </Link>
                        <Link
                            href=""
                            className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 text-gray-800 shadow-2xl shadow-gray-500/20 transition-all hover:bg-gray-800 hover:text-white focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
                        >
                            <div className="w-full text-center">
                                <FontAwesomeIcon
                                    icon={faChartLine}
                                    size="3x"
                                    className="rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-200 to-green-500 p-4 text-gray-800"
                                />

                                <h2 className="mt-6 text-center text-sm font-extrabold tracking-tighter">
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
