import axios from "axios";
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { currencyFormat } from "@/Helpers/currencyFormat";
import { Link } from "@inertiajs/react";
import {
    BanknotesIcon,
    CreditCardIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Modal from "./Modal";

export default function BalanceModal() {
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState([]);

    const closeBalanceModal = () => {
        setShowBalanceModal(false);
    };

    const openBalance = () => {
        setIsLoading(true);
        axios
            .get(route("api.balances.index"))
            .then((d) => {
                setBalance(d.data);
                setIsLoading(false);
                setShowBalanceModal(true);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                setShowBalanceModal(false);
            });
    };
    console.log(
        balance?.reduce((prev, curr) => {
            return prev + Number(curr.amount);
        }, 0)
    );
    return (
        <div>
            <button
                onClick={openBalance}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
            >
                <BanknotesIcon className="w-7" />
            </button>
            {isLoading && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-500/75 opacity-75 dark:bg-gray-900/75">
                    <LoadingSpinner color="yellow" />
                </div>
            )}
            <Modal show={showBalanceModal} onClose={closeBalanceModal}>
                <div className="w-full rounded-lg bg-white p-5 shadow dark:bg-gray-700">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        onClick={closeBalanceModal}
                    >
                        <XMarkIcon className="h-5 w-5" />
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div>
                        <div id="total">
                            <h4 className="text-sm">Total Dompet</h4>
                            <h2 className=" text-2xl font-bold tracking-tighter">
                                {currencyFormat(
                                    balance?.reduce((prev, curr) => {
                                        return prev + Number(curr.amount);
                                    }, 0)
                                )}
                            </h2>
                        </div>
                        <div id="details" className="mt-5">
                            <h4 className="text-sm font-bold">Detail Dompet</h4>
                            {balance &&
                                balance.map((d) => (
                                    <Link
                                        key={d.id}
                                        href={route("balances.show", d.id)}
                                        className="block"
                                    >
                                        <div className="my-4 flex items-center rounded-lg border-2 border-gray-50 p-3 shadow-lg hover:bg-slate-800 hover:text-white">
                                            <CreditCardIcon className="mr-3 w-7 rounded-full bg-green-600 p-1 text-white" />
                                            <div>
                                                <h2 className="text-sm font-bold">
                                                    {d.name}
                                                </h2>
                                                <h4 className="text-sm ">
                                                    {currencyFormat(d.amount)}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
