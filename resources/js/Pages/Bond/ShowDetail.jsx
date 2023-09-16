import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Search from "@/Components/Table/Search";
import { currencyFormat } from "@/Helpers/currencyFormat";
import Paginate from "@/Components/Table/Paginate";

export default function ShowDetail({ auth, debts, q, id }) {
    const test = usePage();
    console.log(test);
    console.log("asd", debts);
    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Jual Beli" />
            <div className="md:p-6">
                <div className="bg-white p-4 md:rounded-md">
                    <Search q={q} addData={{ id }} />
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 font-extrabold"
                                    >
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className=" py-3 font-extrabold"
                                    >
                                        Jumlah
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Aksi</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {debts?.data?.length ? (
                                    debts?.data.map((d, i) => (
                                        <tr
                                            key={i}
                                            className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                        >
                                            <th
                                                scope="row"
                                                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                            >
                                                {d.description}
                                            </th>

                                            <td>
                                                {currencyFormat(d.debt_amount)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {/* <ModalPayDebtForm
                                                    id={d.id}
                                                    balances={balances}
                                                    flash={flash}
                                                />
                                                <ModalDetail id={d.id} /> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="p-3 text-center"
                                        >
                                            Data Kosong
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {debts?.data?.length ? (
                        <Paginate links={debts?.links} meta={debts?.meta} />
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
