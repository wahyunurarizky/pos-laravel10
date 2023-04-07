import React from "react";
import Label from "@/Components/Field/Label";
import { useBuyForm } from "../NewForm";
import { useBuy } from "@/Pages/Trade/Buy";
import Select from "react-select";

export default function InputDropdownUnits({ className, ...props }) {
    const name = "master_unit_id";
    const labelName = "units";

    const {
        watch,
        setValue,
        formState: { errors },
    } = useBuyForm();

    const { master_units } = useBuy();

    const masterUnitOptions = [
        ...master_units.map((d) => {
            return {
                value: d.id,
                label: d.name.join(", "),
                units: d.name.map((unit) => {
                    return { name: unit, parent_ref_qty: 0, price: 0 };
                }),
            };
        }),
    ];

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label name={name} labelName={labelName} />
            <Select
                openMenuOnFocus
                {...props}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                id="master_unit_id"
                onChange={(data) => {
                    setValue("units", data?.units);
                    setValue("unit_name", data?.units[0].name);
                    setValue("master_unit_id", data?.value);
                }}
                options={masterUnitOptions}
                isClearable={true}
                isSearchable={false}
                defaultValue={masterUnitOptions.find(
                    (d) => d.value === watch("master_unit_id")
                )}
            />
            <span className="text-sm text-red-500">
                {errors.master_unit_id?.message}
            </span>
        </div>
    );
}
