import Label from "@/Components/Field/Label";
import Modal from "@/Components/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import chroma from "chroma-js";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input-field";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import { castFloat } from "@/Helpers/castFloat";
import { currencyFormat } from "@/Helpers/currencyFormat";

const schemaCreate = yup
    .object({
        debt_amount: yup.number().required().positive(),
        balance_id: yup.number().required(),
    })
    .required();

export default function ModalDetail({ id }) {
    const [isLoading, setIsLoading] = useState(false);
    const [debter, setDebter] = useState(null);
    const [showModal, setShowModal] = useState(false);

    console.log(debter);

    const showForm = () => {
        axios
            .get(route("api.debts.index", { debter_id: id }))
            .then((d) => {
                setDebter(d.data);
                setShowModal(true);
            })
            .catch((err) => {
                console.log(err);
                setShowModal(false);
            });
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button className="mr-3" onClick={showForm}>
                <EyeIcon className="w-6" />
            </button>
            <Modal show={showModal} onClose={closeModal}>
                {debter && (
                    <div className="w-full rounded-lg bg-white shadow dark:bg-gray-700">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={closeModal}
                        >
                            <XMarkIcon className="h-5 w-5" />
                            <span className="sr-only">Close modal</span>
                        </button>
                        {debter && (
                            <div className="p-6">
                                <h3>Riwayat hutang terbaru</h3>
                                <ul>
                                    {debter.map((d, i) => (
                                        <li key={i}>
                                            {d.description}{" "}
                                            {currencyFormat(d.debt_amount)}{" "}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={route("debters.show.debts", id)}>
                                    lihat selengkapnya
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
