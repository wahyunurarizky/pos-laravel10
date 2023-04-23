import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    InformationCircleIcon,
    PencilSquareIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Paginate from "@/Components/Table/Paginate";
import Search from "@/Components/Table/Search";
import { currencyFormat } from "@/Helpers/currencyFormat";
import Modal from "@/Components/Modal";
import { toast } from "react-toastify";
import _ from "lodash";
import axios from "axios";
import ModalCreateForm from "./ModalCreateForm";

export default function Debt({ auth, debts, balances, q, flash }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const closeCreateModal = () => {
        setShowCreateModal(false);
    };

    const { errors: e } = usePage().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
            setShowCreateModal(false);
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
                    <h3 className="font-bold">Hutang / Piutang</h3>
                    <div>
                        <button
                            onClick={() => {
                                setShowCreateModal(true);
                            }}
                        >
                            Tambah
                        </button>
                        <ModalCreateForm
                            balances={balances}
                            showModal={showCreateModal}
                            closeModal={closeCreateModal}
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
                                        Debter
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
                                                {d.debter?.name}
                                            </th>

                                            <td>{d.type}</td>
                                            <td>{currencyFormat(d.amount)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        // getCashflowById(d.id);
                                                    }}
                                                >
                                                    <PencilSquareIcon className="inline h-5 w-5" />
                                                </button>
                                                {/* <ModalEditForm
                                                    showModal={showEditModal}
                                                    closeModal={closeEditModal}
                                                    cashflow={detailCashflow}
                                                /> */}
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
