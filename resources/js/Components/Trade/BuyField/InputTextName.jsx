import React, { useCallback, useState } from "react";
import _debounce from "lodash/debounce";
import axios from "axios";
import Label from "@/Components/Field/Label";
import { useBuyForm } from "../Form";
import { usePage } from "@inertiajs/react";
import { useBuy } from "@/Pages/Trade/Buy";

export default function InputTextName({ className, setNameIsUsed, ...props }) {
    const [isLoadingNameCheck, setIsLoadingNameCheck] = useState(false);
    const name = "name";
    const labelName = "nama";

    const { box } = useBuy();

    const {
        setError,
        formState: { errors },
        clearErrors,
        register,
    } = useBuyForm();

    const checkUniqueName = useCallback(
        _debounce((value) => {
            axios
                .post(route("api.items.check-unique-name", { name: value }))
                .then((response) => {
                    if (response?.data) {
                        setError(
                            "name",
                            { message: "name already exists" },
                            { shouldFocus: true }
                        );
                        setNameIsUsed(true);
                    } else {
                        clearErrors("name");
                        setNameIsUsed(false);
                    }

                    console.log(box);

                    if (box.some((el) => el.name === value)) {
                        setError(
                            "name",
                            { message: "name already exists" },
                            { shouldFocus: true }
                        );
                        setNameIsUsed(true);
                    }

                    setIsLoadingNameCheck(false);
                })
                .catch((_error) => {
                    // setItems([]);
                    setIsLoadingNameCheck(false);
                });
        }, 1000),
        []
    );

    return (
        <div
            className={className || "group relative z-0 mb-6 w-full"}
            {...props}
        >
            <Label name={name} labelName={labelName} />
            <input
                {...register(name, {
                    onChange: (e) => {
                        setIsLoadingNameCheck(true);
                        checkUniqueName(e.target.value?.toUpperCase());
                    },
                })}
                autoComplete="off"
                type="text"
                id={name}
                className=" block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm uppercase text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            {isLoadingNameCheck && (
                <span className="absolute text-sm ">
                    mengecek {labelName}...
                </span>
            )}
            {!isLoadingNameCheck && (
                <span className="absolute text-sm text-red-500">
                    {errors[name]?.message}
                </span>
            )}
        </div>
    );
}
