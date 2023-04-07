import Modal from "@/Components/Modal";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

export default function Checkout({ submit }) {
    const [showModal, setShowModal] = useState(false);
    const [options, setOptions] = useState([]);

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        axios.get(route("api.seller.index")).then((r) => {
            setOptions(r.data.map((d) => ({ label: d.name, value: d.id })));
        });
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState();

    const handleCreate = (inputValue) => {
        setIsLoading(true);
        axios
            .post(
                route("api.seller.store", {
                    name: inputValue,
                })
            )
            .then((r) => {
                const newData = { label: r.data.name, value: r.data.id };
                setOptions((prev) => [...prev, newData]);
                setValue(newData);
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

                        <CreatableSelect
                            isClearable
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            onChange={(newValue) => setValue(newValue)}
                            onCreateOption={handleCreate}
                            options={options}
                            value={value}
                        />

                        <button
                            onClick={() => {
                                submit(value?.value);
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
