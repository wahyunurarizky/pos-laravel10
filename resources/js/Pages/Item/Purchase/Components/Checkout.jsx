import Label from "@/Components/Field/Label";
import Modal from "@/Components/Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

export default function Checkout({ submit, balances }) {
    const [showModal, setShowModal] = useState(false);
    const [sellerOptions, setSellerOptions] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [seller, setSeller] = useState();
    const [balance, setBalance] = useState();

    const closeModal = () => {
        setShowModal(false);
    };

    const balanceOptions = balances.map((d) => ({
        label: d.name,
        value: d.id,
    }));

    useEffect(() => {
        axios.get(route("api.sellers.index")).then((r) => {
            setSellerOptions(
                r.data.map((d) => ({ label: d.name, value: d.id }))
            );
        });
    }, []);

    const handleCreate = (inputValue) => {
        setIsLoading(true);
        axios
            .post(
                route("api.sellers.store", {
                    name: inputValue,
                })
            )
            .then((r) => {
                console.log("wkwkwkwk");
                const newData = { label: r.data.name, value: r.data.id };
                setSellerOptions((prev) => [...prev, newData]);
                setSeller(newData);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <button
                className="w-full rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
                onClick={() => {
                    setShowModal(true);
                }}
                disabled={showModal}
            >
                BELI
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
                        <Label labelName="Penjual" />
                        <CreatableSelect
                            isClearable
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            onChange={(newValue) => setSeller(newValue)}
                            onCreateOption={handleCreate}
                            options={sellerOptions}
                            value={seller}
                        />
                        <Label labelName="Balance" />
                        <Select
                            onChange={(newValue) => setBalance(newValue)}
                            options={balanceOptions}
                            isClearable={false}
                            isSearchable={false}
                            value={balance}
                        />

                        <button
                            onClick={() => {
                                submit({
                                    seller_id: seller?.value,
                                    balance_id: balance?.value,
                                });
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
