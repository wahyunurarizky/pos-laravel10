import Label from "@/Components/Field/Label";
import Modal from "@/Components/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { router } from "@inertiajs/react";

const schemaCreate = yup
    .object({
        description: yup.string().required(),
    })
    .required();

export default function ModalEditForm({ showModal, closeModal, cashflow }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schemaCreate) });

    const onSubmit = (data) => {
        console.log(cashflow);
        router.put(route("cashflows.update", cashflow?.id), data);
    };

    useEffect(() => {
        setValue("description", cashflow?.description);
    }, [cashflow]);

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
                            <button
                                type="submit"
                                className="mr-2 rounded-lg border-4 px-2 py-1"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
