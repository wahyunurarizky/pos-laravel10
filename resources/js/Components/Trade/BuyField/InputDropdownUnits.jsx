import React from "react";
import MasterUnitSelect from "../MasterUnitSelect";
import { Controller } from "react-hook-form";
import Label from "@/Components/Field/Label";
import { useBuyForm } from "../Form";

export default function InputDropdownUnits({ className }) {
    const name = "master_unit_id";
    const labelName = "units";

    const {
        control,
        setValue,
        formState: { errors },
    } = useBuyForm();

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label name={name} labelName={labelName} />
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value, name, ref, onBlur } }) => (
                    <MasterUnitSelect
                        inputRef={ref}
                        value={value}
                        onChange={onChange}
                        setValue={setValue}
                    />
                )}
            />
            <span className="text-sm text-red-500">
                {errors.master_unit_id?.message}
            </span>
        </div>
    );
}
