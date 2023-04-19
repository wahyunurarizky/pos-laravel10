import Modal from "@/Components/Modal";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

export default function CheckoutSell({ submit }) {
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <button
                className="w-full rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
                onClick={() => {
                    setShowModal(true);
                }}
            >
                JUAL
            </button>
            <Modal show={showModal} onClose={closeModal}>
                <div className="w-full basis-1 rounded-lg bg-white shadow dark:bg-gray-700">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        onClick={closeModal}
                    >
                        <XMarkIcon className="h-5 w-5" />
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6">
                        <table className="w-full text-left">
                            <tbody>
                                <tr>
                                    <th className="border-b-2" colSpan={4}>
                                        Order Details
                                    </th>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Dji Sam Soe</td>
                                    <td>@Rp 33000</td>
                                    <td>Rp 120,000</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Dji Sam Soe</td>
                                    <td>@Rp 33000</td>
                                    <td>Rp 120,000</td>
                                </tr>
                                <tr className="border-t-2">
                                    <td colSpan={3} className="font-bold">
                                        TOTAL
                                    </td>
                                    <td>Rp 120.000</td>
                                </tr>
                            </tbody>
                        </table>

                        <button
                            onClick={() => {
                                submit();
                                setShowModal(false);
                            }}
                            type="button"
                            className="mt-4 mr-2 inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                        >
                            Ya, yakin
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
