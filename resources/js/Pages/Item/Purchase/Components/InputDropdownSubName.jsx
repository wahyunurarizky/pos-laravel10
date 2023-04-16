import Label from "@/Components/Field/Label";
import React from "react";
import CreatableSelect from "react-select/creatable";
import { useBuyForm } from "@/Pages/Item/Purchase/Components/NewForm";
import "react-toggle/style.css"; // for ES6 modules

export default function InputDropdownSubName({ className }) {
    const name = "sub_name";
    const labelName = "sub nama";

    const { watch, setValue } = useBuyForm();

    return (
        <div className={className || "group relative z-0 mb-6 w-full"}>
            <Label name={name} labelName={labelName} />

            <CreatableSelect
                onChange={(val) => {
                    setValue(
                        "sub_name",
                        val.map((d) => d.value)
                    );
                }}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                isMulti
                placeholder={"ketik untuk menambahkan"}
                defaultValue={watch("sub_name").map((d) => {
                    return { value: d, label: d };
                })}
            />
        </div>
    );
}
