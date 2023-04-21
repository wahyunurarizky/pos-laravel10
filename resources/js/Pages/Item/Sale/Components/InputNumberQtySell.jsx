import React, { useCallback, useState } from "react";
import Label from "@/Components/Field/Label";
import _debounce from "lodash/debounce";
import { useSellForm } from "./Form";
import { castFloat } from "@/Helpers/castFloat";

export default function InputNumberQtySell({
    className,
    bottom_unit_qty,
    setStockNotAvailable,
    setIsDisabled,
}) {
    const {
        watch,
        setError,
        setValue,
        formState: { errors },
        register,
        clearErrors,
    } = useSellForm();

    const [isLoadingAvailableStockCheck, setIsLoadingAvailableStockCheck] =
        useState(false);

    const labelName = "banyaknya";
    const name = "per_unit_qty";

    const checkAvailableStock = useCallback(
        _debounce((unit_id, per_unit_qty) => {
            axios
                .post(
                    route("api.items.check-available-stock", {
                        unit_id,
                        per_unit_qty,
                        bottom_unit_qty,
                    })
                )
                .then((response) => {
                    console.log(response.data);
                    if (response?.data) {
                        clearErrors("per_unit_qty");
                        setStockNotAvailable(false);
                    } else {
                        setError(
                            "per_unit_qty",
                            { message: "stock not available" },
                            { shouldFocus: true }
                        );
                        setStockNotAvailable(true);
                    }
                    setIsDisabled(false);
                    setIsLoadingAvailableStockCheck(false);
                })
                .catch((_error) => {
                    // setItems([]);
                    setIsLoadingAvailableStockCheck(false);
                });
        }, 500),
        []
    );

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label name={name} labelName={labelName} />
            <input
                {...register(name, {
                    setValueAs: (v) => (v === "" ? null : v),
                    // valueAsNumber: true,
                    onChange: (e) => {
                        setIsLoadingAvailableStockCheck(true);
                        setIsDisabled(true);
                        checkAvailableStock(watch("unit_id"), e.target.value);
                        setValue(
                            "total",
                            castFloat(
                                Math.round(
                                    watch(name) * watch("price_per_unit") * 100
                                ) / 100
                            )
                        );
                    },
                })}
                type="number"
                // autoFocus
                step={0.01}
                id={name}
                className="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <select
                className="ml-3 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("unit_id")}
                onChange={(e) => {
                    setValue(
                        "price_per_unit",
                        watch("units").find((d) => d.unit_id == e.target.value)
                            ?.price
                    );
                    setValue("unit_id", e.target.value);

                    setIsDisabled(true);

                    setIsLoadingAvailableStockCheck(true);
                    checkAvailableStock(e.target.value, watch("per_unit_qty"));

                    setValue(
                        "total",
                        castFloat(
                            Math.round(
                                watch(name) * watch("price_per_unit") * 100
                            ) / 100
                        )
                    );
                }}
            >
                {watch("units").map((d, i) => (
                    <option key={i} value={d.unit_id}>
                        {d.unit_name}
                    </option>
                ))}
            </select>
            {isLoadingAvailableStockCheck ? (
                <span className="absolute text-sm ">mengecek stok...</span>
            ) : (
                <span className="block text-sm text-red-500">
                    {errors.per_unit_qty?.message}
                </span>
            )}
        </div>
    );
}
