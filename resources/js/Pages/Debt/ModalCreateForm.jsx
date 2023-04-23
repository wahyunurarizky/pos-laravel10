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
import { router, usePage } from "@inertiajs/react";
import _ from "lodash";
import { toast } from "react-toastify";

const schemaCreate = yup
    .object({
        debter_id: yup.number().required(),
        debt_amount: yup.number().required().positive(),
        balance_id: yup.number().required(),
    })
    .required();

export default function ModalCreateForm({ showModal, closeModal, balances }) {
    const [debterOptions, setDebterOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { errors: e } = usePage().props;

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
        router.post(route("debters.store"), data);
    };
    console.log(watch());

    // const dot = (color = "transparent") => ({
    //     alignItems: "center",
    //     display: "flex",

    //     ":before": {
    //         backgroundColor: color,
    //         borderRadius: 10,
    //         content: '" "',
    //         display: "block",
    //         marginRight: 8,
    //         height: 10,
    //         width: 10,
    //     },
    // });

    // const colourStyles = {
    //     control: (styles) => ({ ...styles, backgroundColor: "white" }),
    //     option: (styles, { data, isFocused, isSelected }) => {
    //         const color = chroma(data.color);
    //         return {
    //             ...styles,
    //             backgroundColor: isSelected
    //                 ? data.color
    //                 : isFocused
    //                 ? color.alpha(0.1).css()
    //                 : undefined,
    //             color: isSelected
    //                 ? chroma.contrast(color, "white") > 2
    //                     ? "white"
    //                     : "black"
    //                 : "black",
    //             cursor: "pointer",

    //             ":active": {
    //                 ...styles[":active"],
    //                 backgroundColor: isSelected
    //                     ? data.color
    //                     : color.alpha(0.3).css(),
    //             },
    //         };
    //     },
    //     input: (styles) => ({ ...styles, ...dot() }),
    //     placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    //     singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    // };

    // const typeOptions = [
    //     {
    //         value: "debt",
    //         label: "Hutang",
    //         color: "lightgreen",
    //     },
    //     {
    //         value: "outdebt",
    //         label: "Piutang",
    //         color: "red",
    //     },
    // ];

    const balanceOptions = balances.map((d) => ({
        value: d.id,
        label: d.name,
    }));

    useEffect(() => {
        axios.get(route("api.debters.index")).then((r) => {
            setDebterOptions(
                r.data.map((d) => ({ label: d.name, value: d.id }))
            );
        });
    }, []);

    const handleCreate = (inputValue) => {
        setIsLoading(true);
        axios
            .post(route("api.debters.store"), {
                name: inputValue,
            })
            .then((r) => {
                console.log("wkwkwkwk");
                const newData = { label: r.data.name, value: r.data.id };
                setDebterOptions((prev) => [...prev, newData]);
                setValue("debter_id", r.data.id);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
            });
    };

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
                            <Label labelName="Penghutang" />
                            <CreatableSelect
                                isClearable
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                onChange={(newValue) =>
                                    setValue("debter_id", newValue?.value)
                                }
                                onCreateOption={handleCreate}
                                options={debterOptions}
                                value={debterOptions.find(
                                    (o) => o.value === watch("debter_id")
                                )}
                            />
                            <span className="absolute text-sm text-red-500">
                                {errors["debter_id"]?.message}
                            </span>
                        </div>
                        <div className="group relative mb-6 w-full">
                            <Label name="debt_amount" labelName="Jumlah" />
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
                                        setValue("debt_amount", newValue);
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
