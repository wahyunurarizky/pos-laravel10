import Label from "@/Components/Field/Label";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import Toggle from "react-toggle";
import { useBuyForm } from "../Form";

export default function InputPriceTotal({
    className,
    inputByTotal,
    setInputByTotal,
}) {
    const { watch, setValue } = useBuyForm();

    const name = "total";
    const labelName = "total";
    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label labelName={labelName} name={name} />
            <CurrencyInput
                allowDecimals
                decimalSeparator="."
                className=" disabled:ring-0block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:border-none disabled:bg-inherit disabled:outline-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                id="total"
                name="total"
                prefix="Rp "
                value={watch("total")}
                onValueChange={(newValue) => {
                    if (newValue === undefined) {
                        setValue("total", 0);
                    } else {
                        setValue("total", newValue);
                    }
                }}
                disabled={!inputByTotal}
                step={1}
            />
            <Toggle
                id="toggle-total"
                defaultChecked={inputByTotal}
                onChange={() => {
                    setValue("price_per_unit", 0);
                    setInputByTotal((prev) => !prev);
                }}
            />
            <label htmlFor="toggle-total">Ubah Langsung Dari Total</label>
        </div>
    );
}
