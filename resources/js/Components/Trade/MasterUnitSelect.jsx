import { useBuy } from "@/Pages/Trade/Buy";
import ButtonMain from "../ButtonMain";
import Select, { components } from "react-select";

export default function MasterUnitSelect({
    onChange,
    value,
    name,
    inputRef,
    // setMasterUnitIds,
    setValue,
    ...props
}) {
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
        { custom: true },
    ];

    const CustomOption = (p) => {
        const { data, innerRef, innerProps } = p;
        return data.custom ? (
            <span>Tambah baru disini</span>
        ) : (
            <components.Option {...p} />
        );
    };

    return (
        <div>
            <Select
                openMenuOnFocus
                {...props}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                id="master_unit_id"
                inputRef={inputRef}
                onChange={(data) => {
                    setValue("units", data?.units);
                    setValue("unit_name", data?.units[0].name);
                    onChange(data?.value);
                }}
                options={masterUnitOptions}
                isClearable={true}
                isSearchable={false}
                components={{ Option: CustomOption }}
            />
        </div>
    );
}
