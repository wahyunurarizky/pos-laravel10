import React from "react";
import Label from "@/Components/Field/Label";
import { useBuyForm } from "../ExistForm";

export default function InputNumberQtyBuyExistForm({ className }) {
    const {
        watch,
        setValue,
        formState: { errors },
        register,
    } = useBuyForm();

    const labelName = "banyaknya";
    const name = "per_unit_qty";

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label name={name} labelName={labelName} />
            <input
                {...register(name, {
                    setValueAs: (v) => (v === "" ? null : v),
                    // valueAsNumber: true,
                    onChange: (e) => {
                        setValue(
                            "total",
                            (
                                Math.round(
                                    watch(name) * watch("price_per_unit") * 100
                                ) / 100
                            ).toFixed(2)
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
                            ?.price_per_unit
                    );
                    setValue(
                        "total",
                        (
                            Math.round(
                                watch(name) * watch("price_per_unit") * 100
                            ) / 100
                        ).toFixed(2)
                    );
                }}
            >
                {watch("units").map((d, i) => (
                    <option key={i} value={d.unit_id}>
                        {d.unit_name}
                    </option>
                ))}
            </select>
            <span className="block text-sm text-red-500">
                {errors.per_unit_qty?.message}
            </span>
        </div>
    );
}
