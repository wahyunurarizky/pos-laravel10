import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { currencyFormat } from "@/Helpers/currencyFormat";
import ButtonMain from "@/Components/ButtonMain";
import Search from "@/Components/Table/Search";
import { EyeIcon } from "@heroicons/react/24/outline";
import Paginate from "@/Components/Table/Paginate";
import axios from "axios";

export default function Show({ auth, balance, history_balance, q }) {
    console.log(history_balance);
    const showDetailById = (id) => {
        axios.get(route("api.historybalances.show", id)).then((d) => {
            console.log(d);
        });
    };

    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Show balances" />
            <div className="md:p-6">
                <div className="md:rounded:md bg-white p-4">
                    <p>{balance.name}</p>
                    <p>Saldo: {currencyFormat(balance.amount)}</p>
                    <div className="bg-white p-4 md:rounded-md">
                        <h3 className="font-bold">Riwayat</h3>
                        <Search q={q} />
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 font-extrabold"
                                        >
                                            riwayat
                                        </th>
                                        <th
                                            scope="col"
                                            className=" py-3 font-extrabold"
                                        >
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history_balance?.data?.length ? (
                                        history_balance?.data.map((d, i) => (
                                            <tr
                                                key={i}
                                                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                                >
                                                    {d.message}
                                                </th>

                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            showDetailById(
                                                                d.id
                                                            );
                                                        }}
                                                    >
                                                        <EyeIcon className="inline h-5 w-5" />
                                                    </button>
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
                        {history_balance?.data?.length ? (
                            <Paginate
                                links={history_balance?.links}
                                meta={history_balance?.meta}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
