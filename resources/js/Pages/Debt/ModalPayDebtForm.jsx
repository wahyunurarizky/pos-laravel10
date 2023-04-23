import Label from "@/Components/Field/Label";
import Modal from "@/Components/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import chroma from "chroma-js";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input-field";
import { router } from "@inertiajs/react";
import axios from "axios";
import { castFloat } from "@/Helpers/castFloat";

const schemaCreate = yup
    .object({
        debt_amount: yup.number().required().positive(),
        balance_id: yup.number().required(),
    })
    .required();

export default function ModalPayDebtForm({ id, balances, flash }) {
    const [isLoading, setIsLoading] = useState(false);
    const [debter, setDebter] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (flash.message) {
            setShowModal(false);
        }
    }, [flash]);

    const defaultValues = {
        debt_amount: 0,
        balance_id: balances[0].id,
    };
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({ defaultValues, resolver: yupResolver(schemaCreate) });

    const onSubmit = (data) => {
        const dataPost = {
            ...data,
            is_pay: true,
            description: "Bayar",
            debter_id: debter.id,
        };
        router.post(route("debters.store"), dataPost);
    };

    const balanceOptions = balances.map((d) => ({
        value: d.id,
        label: d.name,
    }));

    const showForm = () => {
        axios
            .get(route("api.debters.show", id))
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
                Bayar
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
                        <div className="p-6">
                            <h3 className="mb-3 text-center text-lg font-bold">
                                Tambah Data
                            </h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setValue(
                                                "debt_amount",
                                                castFloat(debter.amount)
                                            );
                                        }}
                                    >
                                        lunas
                                    </button>
                                </div>
                                <div className="group relative mb-6 w-full">
                                    <Label
                                        name="debt_amount"
                                        labelName="Jumlah"
                                    />
                                    <CurrencyInput
                                        allowDecimals
                                        decimalSeparator="."
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:border-none disabled:bg-inherit disabled:outline-0 disabled:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        id="debt_amount"
                                        name="debt_amount"
                                        prefix="Rp "
                                        value={watch("debt_amount")}
                                        onValueChange={(newValue) => {
                                            if (newValue === undefined) {
                                                setValue("debt_amount", 0);
                                            } else {
                                                setValue(
                                                    "debt_amount",
                                                    newValue
                                                );
                                            }
                                        }}
                                        step={0.01}
                                    />
                                    <span className="absolute text-sm text-red-500">
                                        {errors["debt_amount"]?.message}
                                    </span>
                                </div>
                                {/* <div className="group relative mb-6 w-full">
                            <Label name="type" labelName="Tipe" />
                            <Select
                                onChange={(d) => {
                                    setValue("type", d.value);
                                }}
                                value={typeOptions.find(
                                    (o) => o.value === watch("type")
                                )}
                                options={typeOptions}
                                styles={colourStyles}
                            />
                            <span className="absolute text-sm text-red-500">
                                {errors["type"]?.message}
                            </span>
                        </div> */}
                                <div className="group relative mb-6 w-full">
                                    <Label
                                        name="balance_id"
                                        labelName="Balance"
                                    />
                                    <Select
                                        onChange={(d) => {
                                            setValue("balance_id", d.value);
                                        }}
                                        value={balanceOptions.find(
                                            (o) =>
                                                o.value === watch("balance_id")
                                        )}
                                        options={balanceOptions}
                                    />
                                    <span className="absolute text-sm text-red-500">
                                        {errors["balance_id"]?.message}
                                    </span>
                                </div>
                                <div className="group relative mb-6 w-full">
                                    <button
                                        type="submit"
                                        className="mr-2 rounded-lg border-4 px-2 py-1"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            reset();
                                        }}
                                        className="rounded-lg border-4 px-2 py-1"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
