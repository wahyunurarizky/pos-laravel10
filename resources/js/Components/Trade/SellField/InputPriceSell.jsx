import Label from "@/Components/Field/Label";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import { useSellForm } from "../Sell/Form";

export default function InputPriceBuyExistForm({ className, inputByTotal }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useSellForm();
    const labelName = `Harga jual per ${
        watch("units").find((d) => d.unit_id == watch("unit_id"))?.unit_name
    }`;
    const name = "price_per_unit";

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label labelName={labelName} />
            <CurrencyInput
                allowDecimals
                decimalSeparator="."
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:border-none disabled:bg-inherit disabled:outline-0 disabled:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                id={name}
                name={name}
                prefix="Rp "
                value={watch(name)}
                onValueChange={(newValue) => {
                    if (newValue === undefined) {
                        setValue(name, 0);
                    } else {
                        setValue(name, newValue);
                    }
                    setValue(
                        "total",
                        (
                            Math.round(
                                watch(name) * watch("per_unit_qty") * 100
                            ) / 100
                        ).toFixed(2)
                    );
                }}
                disabled={inputByTotal}
                step={1}
            />
            <span className="block text-sm text-red-500">
                {errors.price_per_unit?.message}
            </span>
        </div>
    );
}
