import Label from "@/Components/Field/Label";
import Modal from "@/Components/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import chroma from "chroma-js";
import CurrencyInput from "react-currency-input-field";
import { router } from "@inertiajs/react";

const schemaCreate = yup
    .object({
        description: yup.string().required(),
        amount: yup.number().required().positive(),
        type: yup.string().required(),
        balance_id: yup.number().required(),
    })
    .required();

export default function ModalCreateForm({ showModal, closeModal, balances }) {
    const defaultValues = {
        amount: 0,
        type: "inflow",
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
        const d = router.post(route("cashflow.store"), data);
        console.log(d);
    };

    const dot = (color = "transparent") => ({
        alignItems: "center",
        display: "flex",

        ":before": {
            backgroundColor: color,
            borderRadius: 10,
            content: '" "',
            display: "block",
            marginRight: 8,
            height: 10,
            width: 10,
        },
    });

    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: "white" }),
        option: (styles, { data, isFocused, isSelected }) => {
            const color = chroma(data.color);
            return {
                ...styles,
                backgroundColor: isSelected
                    ? data.color
                    : isFocused
                    ? color.alpha(0.1).css()
                    : undefined,
                color: isSelected
                    ? chroma.contrast(color, "white") > 2
                        ? "white"
                        : "black"
                    : "black",
                cursor: "pointer",

                ":active": {
                    ...styles[":active"],
                    backgroundColor: isSelected
                        ? data.color
                        : color.alpha(0.3).css(),
                },
            };
        },
        input: (styles) => ({ ...styles, ...dot() }),
        placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
        singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    };

    const typeOptions = [
        {
            value: "inflow",
            label: "uang masuk",
            color: "lightgreen",
        },
        {
            value: "outflow",
            label: "uang keluar",
            color: "red",
        },
    ];

    const balanceOptions = balances.map((d) => ({
        value: d.id,
        label: d.name,
    }));

    return (
        <Modal show={showModal} onClose={closeModal}>
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
                        <div className="group relative mb-6 w-full">
                            <Label name="description" labelName="deskripsi" />
                            <input
                                {...register("description")}
                                autoComplete="off"
                                type="text"
                                id="description"
                                className=" block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            />
                            <span className="absolute text-sm text-red-500">
                                {errors["description"]?.message}
                            </span>
                        </div>
                        <div className="group relative mb-6 w-full">
                            <Label name="amount" labelName="Jumlah" />
                            <CurrencyInput
                                allowDecimals
                                decimalSeparator="."
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:border-none disabled:bg-inherit disabled:outline-0 disabled:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                id="amount"
                                name="amount"
                                prefix="Rp "
                                value={watch("amount")}
                                onValueChange={(newValue) => {
                                    if (newValue === undefined) {
                                        setValue("amount", 0);
                                    } else {
                                        setValue("amount", newValue);
                                    }
                                }}
                                step={0.01}
                            />
                            <span className="absolute text-sm text-red-500">
                                {errors["amount"]?.message}
                            </span>
                        </div>
                        <div className="group relative mb-6 w-full">
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
                        </div>
                        <div className="group relative mb-6 w-full">
                            <Label name="balance_id" labelName="Balance" />
                            <Select
                                onChange={(d) => {
                                    setValue("balance_id", d.value);
                                }}
                                value={balanceOptions.find(
                                    (o) => o.value === watch("balance_id")
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
        </Modal>
    );
}
