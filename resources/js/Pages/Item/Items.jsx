import ButtonMain from "@/Components/ButtonMain";
import Paginate from "@/Components/Table/Paginate";
import Search from "@/Components/Table/Search";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { ShoppingBagIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import DetailItems from "./DetailItems";

export default function Index({ auth, items, q, flash }) {
    console.log(items);

    const { errors: e } = usePage().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    useEffect(() => {
        if (!_.isEmpty(e)) {
            toast.error(_.values(e).join(", "));
        }
    }, [e]);

    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Jual Beli" />
            <div className="md:p-6">
                <div className="bg-white p-4 md:rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 md:h-auto">
                            <Link href={route("items.sell")}>
                                <ButtonMain className="h-full w-full">
                                    Jual
                                    <ShoppingCartIcon className="w-8 sm:w-12" />
                                </ButtonMain>
                            </Link>
                            <Link
                                href={route("items.history-sell")}
                                className="pl-2 text-xs underline"
                            >
                                Riwayat Penjualan
                            </Link>
                        </div>
                        <div className="h-16 text-right md:h-auto">
                            <Link href={route("items.buy")}>
                                <ButtonMain className="h-full w-full">
                                    <ShoppingBagIcon className="w-8 sm:w-12" />
                                    Beli
                                </ButtonMain>
                            </Link>
                            <Link
                                href={route("items.history-buy")}
                                className="pr-2 text-xs underline"
                            >
                                Riwayat pembelian
                            </Link>
                        </div>
                    </div>
                    <div className="mt-10 border-t-2 pt-3">
                        <h3 className="text-center text-xl font-bold">
                            Data Dagangan Saat Ini
                        </h3>
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
                                        <th scope="col" className="px-6 py-3">
                                            stok
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">
                                                Action
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {items?.data?.length ? (
                                        items?.data.map((d, i) => (
                                            <tr
                                                key={i}
                                                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                                >
                                                    {d.name}
                                                </th>
                                                <td className="flex px-6 py-4">
                                                    {d.stock
                                                        .slice(0)
                                                        .reverse()
                                                        .map((s, si) => (
                                                            <div
                                                                key={si}
                                                                className="mr-2 rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-gray-700 dark:text-green-400"
                                                            >
                                                                {s}
                                                            </div>
                                                        ))}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DetailItems id={d.id} />
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
                        {items?.data?.length ? (
                            <Paginate links={items?.links} meta={items?.meta} />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
