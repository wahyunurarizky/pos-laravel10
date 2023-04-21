import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Paginate from "@/Components/Table/Paginate";
import Search from "@/Components/Table/Search";
import PrimaryButton from "@/Components/PrimaryButton";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import "moment/dist/locale/id";
import { currencyFormat } from "@/Helpers/currencyFormat";
import { castFloat } from "@/Helpers/castFloat";
moment.locale("id");

export default function History({ auth, item_purchases, q }) {
    console.log(item_purchases);
    return (
        <AuthenticatedLayout auth={auth} className>
            <div className="p-6">
                <div>
                    <Head title="Riwayat Beli" />
                    <Link href={route("items.index")}>
                        <PrimaryButton className="m-2">Back</PrimaryButton>
                    </Link>
                </div>
                <div className="my-4 rounded-md bg-white p-4">
                    <div className="mt-10">
                        <h3 className="font-bold">Riwayat Beli</h3>
                        <Search q={q} />
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 font-extrabold"
                                        >
                                            Nama
                                        </th>
                                        <th
                                            scope="col"
                                            className=" py-3 font-extrabold"
                                        >
                                            Tanggal
                                        </th>
                                        <th
                                            scope="col"
                                            className=" py-3 font-extrabold"
                                        >
                                            Penjual
                                        </th>
                                        <th
                                            scope="col"
                                            className=" py-3 font-extrabold"
                                        >
                                            Banyaknya
                                        </th>
                                        <th
                                            scope="col"
                                            className=" py-3 font-extrabold"
                                        >
                                            Harga
                                        </th>
                                        <th
                                            scope="col"
                                            className=" py-3 font-extrabold"
                                        >
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">
                                                Action
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item_purchases?.data?.length ? (
                                        item_purchases?.data.map((d, i) => (
                                            <tr
                                                key={i}
                                                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                                >
                                                    {d.item
                                                        ? d.item.name
                                                        : "deleted data"}
                                                </th>

                                                <td>
                                                    {moment(
                                                        d.purchase.created_at
                                                    ).format(
                                                        "DD MMMM YYYY, kk:mm"
                                                    )}
                                                </td>

                                                <td>
                                                    {d.purchase.seller?.name}
                                                </td>
                                                <td>
                                                    {castFloat(d.per_unit_qty)}{" "}
                                                    {d.unit?.name}
                                                </td>
                                                <td>
                                                    @
                                                    {currencyFormat(
                                                        d.price_per_unit
                                                    )}
                                                </td>
                                                <td className="font-bold">
                                                    {currencyFormat(d.total)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <a
                                                        href="#"
                                                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                    >
                                                        <InformationCircleIcon className="inline h-10 w-10" />
                                                    </a>
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
                        {item_purchases?.data?.length ? (
                            <Paginate
                                links={item_purchases?.links}
                                meta={item_purchases?.meta}
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
