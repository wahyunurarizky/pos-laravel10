import React from "react";
import { useBuyForm } from "../NewForm";
import Label from "@/Components/Field/Label";
import { usePage } from "@inertiajs/react";

export default function InputUnitsDetail() {
    const name = "units";
    const labelName = "input satuan";
    const { watch, setValue } = useBuyForm();

    const { errors } = usePage().props;

    return (
        <div className="group relative z-0 mb-6 w-full">
            <Label name={name} labelName={labelName} />
            <table>
                <tbody>
                    {watch("units")?.map((d, i, a) =>
                        a[i + 1] ? (
                            <tr key={i}>
                                <td>1 {d.name} </td>
                                <td>
                                    =
                                    <input
                                        step={1}
                                        required
                                        type="number"
                                        className="mx-3 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        value={
                                            watch("units")[i + 1]
                                                .parent_ref_qty || ""
                                        }
                                        onChange={(e) => {
                                            console.log(e.target.value);
                                            const arr = [...watch("units")];
                                            arr[i + 1].parent_ref_qty =
                                                parseInt(e.target.value);
                                            setValue("units", arr);
                                        }}
                                    />
                                </td>
                                <td>
                                    {a[i + 1].name}{" "}
                                    <span className="text-sm text-red-500">
                                        {
                                            errors[
                                                `units.${i + 1}.parent_ref_qty`
                                            ]
                                        }
                                    </span>
                                </td>
                            </tr>
                        ) : (
                            <tr key={i}></tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}
