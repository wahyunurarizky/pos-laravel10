import React from "react";
import Label from "@/Components/Field/Label";
import Select from "react-select";
import { useSellForm } from "../Sell/Form";

export default function InputSubName({ className, options = [], ...props }) {
    const name = "sub_name";
    const labelName = "Sub Name";

    const {
        watch,
        setValue,
        formState: { errors },
    } = useSellForm();

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label name={name} labelName={labelName} />
            <Select
                openMenuOnFocus
                {...props}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                id="sub_name"
                onChange={(d) => {
                    setValue("sub_name", d.value);
                }}
                options={options}
                isClearable={true}
                isSearchable={false}
            />
            <span className="text-sm text-red-500">
                {errors.sub_name?.message}
            </span>
        </div>
    );
}
