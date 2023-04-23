import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Utang Piutang" />
            <div className="flex md:p-6">
                <Link
                    href={route("debters.index")}
                    className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 shadow-2xl shadow-gray-500/20 transition-all focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
                >
                    <div className="flex w-full flex-col align-middle">
                        <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900 dark:text-white">
                            Hutang
                        </h2>
                    </div>
                </Link>
                <Link
                    href={route("debters.index")}
                    className="duration-250 flex scale-100 rounded-lg bg-white from-gray-700/50 via-transparent p-6 shadow-2xl shadow-gray-500/20 transition-all focus:outline focus:outline-2 focus:outline-red-500 motion-safe:hover:scale-[1.01] dark:bg-gray-800/50 dark:bg-gradient-to-bl dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/5"
                >
                    <div className="flex w-full flex-col align-middle">
                        <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900 dark:text-white">
                            Piutang
                        </h2>
                    </div>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
