import Label from "@/Components/Field/Label";
import React from "react";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { useBuyForm } from "../Form";
import "react-toggle/style.css"; // for ES6 modules

export default function InputDropdownSubName({ className }) {
    const name = "sub_name";
    const labelName = "sub nama";
    const options = [];

    const { control } = useBuyForm();

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label name={name} labelName={labelName} />
            <Controller
                id={name}
                control={control}
                name={name}
                render={({ field: { onChange, value, name, ref, onBlur } }) => (
                    <CreatableSelect
                        inputRef={ref}
                        onChange={(val) => onChange(val.map((c) => c.value))}
                        menuPortalTarget={document.body}
                        menuPosition={"fixed"}
                        options={options}
                        isMulti
                        placeholder={"ketik untuk menambahkan"}
                        is
                    />
                )}
            />
        </div>
    );
}
