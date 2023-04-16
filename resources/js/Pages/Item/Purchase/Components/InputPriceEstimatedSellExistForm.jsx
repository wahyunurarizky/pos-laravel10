import Label from "@/Components/Field/Label";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import { useBuyForm } from "@/Pages/Item/Purchase/Components/ExistForm";

export default function InputPriceEstimatedSellExistForm({ className }) {
    const labelName = "Perencanaan Harga Jual";

    const { watch, setValue } = useBuyForm();

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label labelName={labelName} />
            {watch("units").map((d, i) => (
                <div className="my-1 flex items-center" key={i}>
                    <label htmlFor="" className="w-40">
                        harga per {d.unit_name}{" "}
                    </label>
                    <CurrencyInput
                        allowDecimals
                        decimalSeparator="."
                        className=" disabled:ring-0block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:border-none disabled:bg-inherit disabled:outline-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        prefix="Rp "
                        value={d.price}
                        onValueChange={(newValue) => {
                            const arr = [...watch("units")];
                            if (newValue === undefined) {
                                arr[i].price = 0;
                            } else {
                                arr[i].price = newValue;
                            }
                            setValue("units", arr);
                        }}
                        step={1}
                    />
                </div>
            ))}
        </div>
    );
}
