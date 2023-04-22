import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Paginate from "@/Components/Table/Paginate";
import Search from "@/Components/Table/Search";
import { currencyFormat } from "@/Helpers/currencyFormat";
import Modal from "@/Components/Modal";
import ModalCreateForm from "./ModalCreateForm";
import { toast } from "react-toastify";
import _ from "lodash";

export default function Cashflow({ auth, cashflows, balances, q, flash }) {
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    };

    const { errors: e } = usePage().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
            setShowModal(false);
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
                    <h3 className="font-bold">Pemasukan / Pengeluaran</h3>
                    <div>
                        <button
                            onClick={() => {
                                setShowModal(true);
                            }}
                        >
                            Tambah
                        </button>
                        <ModalCreateForm
                            balances={balances}
                            showModal={showModal}
                            closeModal={closeModal}
                        />
                    </div>
                    <Search q={q} />
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 font-extrabold"
                                    >
                                        desc
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
                                        Balance
                                    </th>
                                    <th
                                        scope="col"
                                        className=" py-3 font-extrabold"
                                    >
                                        Awal
                                    </th>
                                    <th
                                        scope="col"
                                        className=" py-3 font-extrabold"
                                    >
                                        Akhir
                                    </th>
                                    <th
                                        scope="col"
                                        className=" py-3 font-extrabold"
                                    >
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        className=" py-3 font-extrabold"
                                    >
                                        Jumlah
                                    </th>
                                    <th
                                        scope="col"
                                        className=" py-3 font-extrabold"
                                    >
                                        Aksi
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cashflows?.data?.length ? (
                                    cashflows?.data.map((d, i) => (
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
                                                {moment(d.created_at).format(
                                                    "DD MMMM YYYY, kk:mm"
                                                )}
                                            </td>
                                            <td>{d.balance.name}</td>
                                            <td>
                                                {currencyFormat(
                                                    d.amount_balance_before
                                                )}
                                            </td>
                                            <td>
                                                {currencyFormat(
                                                    d.amount_balance_after
                                                )}
                                            </td>

                                            <td>{d.type}</td>
                                            <td>{currencyFormat(d.amount)}</td>
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
                    {cashflows?.data?.length ? (
                        <Paginate
                            links={cashflows?.links}
                            meta={cashflows?.meta}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
