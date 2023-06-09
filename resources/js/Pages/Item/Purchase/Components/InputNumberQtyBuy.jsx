import React from "react";
import { useBuyForm } from "@/Pages/Item/Purchase/Components/NewForm";
import Label from "@/Components/Field/Label";
import { castFloat } from "@/Helpers/castFloat";

export default function InputNumberQtyBuy({ className }) {
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
                            castFloat(
                                Math.round(
                                    watch(name) * watch("price_per_unit") * 100
                                ) / 100
                            )
                        );
                    },
                })}
                step={0.01}
                type="number"
                id={name}
                className="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <select
                className="ml-3 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("unit_name")}
            >
                {watch("units").map((d, i) => (
                    <option key={i} value={d.name}>
                        {d.name}
                    </option>
                ))}
            </select>
            <span className="block text-sm text-red-500">
                {errors.per_unit_qty?.message}
            </span>
        </div>
    );
}
