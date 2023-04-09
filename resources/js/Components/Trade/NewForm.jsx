import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputDropdownUnits from "./BuyField/InputDropdownUnits";
import InputTextName from "./BuyField/InputTextName";
import InputDropdownSubName from "./BuyField/InputDropdownSubName";
import InputUnitsDetail from "./BuyField/InputUnitsDetail";
import InputNumberQtyBuy from "./BuyField/InputNumberQtyBuy";
import InputPriceBuy from "./BuyField/InputPriceBuy";
import InputPriceTotal from "./BuyField/InputPriceTotal";
import InputPriceEstimatedSell from "./BuyField/InputPriceEstimatedSell";
import Edit from "./Button/Edit";
import Delete from "./Button/Delete";
import Minimize from "./Button/Minimize";

export const useBuyForm = useFormContext;

const schema = yup
    .object({
        name: yup.string().required(),
        master_unit_id: yup.number().required(),
        units: yup.array().of(
            yup.object().shape({
                name: yup.string().required(),
                price: yup.number(),
                parent_ref_qty: yup.number().required(),
            })
        ),
        sub_name: yup.array().of(yup.string()),
        per_unit_qty: yup.string().required(),
        price_per_unit: yup.number().required().positive("the total not valid"),
        total: yup.number().positive("the total not valid"),
    })
    .required();

export default function NewForm({
    minimizeBox,
    updateBox,
    d,
    editButtonClick,
    deleteButtonClick,
}) {
    const method = useForm({
        defaultValues: {
            master_unit_id: d.master_unit_id,
            name: d.name,
            per_unit_qty: d.per_unit_qty,
            unit_name: d.unit_name,
            sub_name: d.sub_name || [],
            units: d.units || [],
            price_per_unit: d.price_per_unit || 0,
            total: d.total || 0,
        },
        shouldFocusError: true,
        mode: "onSubmit",
        resolver: yupResolver(schema),
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = method;

    const [isDisabled, setIsDisabled] = useState(false);
    const [inputByTotal, setInputByTotal] = useState(d.inputByTotal || false);
    const [nameIsUsed, setNameIsUsed] = useState(false);

    const onSubmit = (data) => {
        console.log(data);
        if (nameIsUsed) {
            setError(
                "name",
                { message: "name already exists" },
                { shouldFocus: true }
            );
            return;
        }

        data.edit = false;
        data.isNew = true;
        data.inputByTotal = inputByTotal;
        data.isSaved = true;

        updateBox({ ...data, name: data.name.toUpperCase() });
    };

    register("units");

    console.log(errors);

    return (
        <div className="shadow-0 mb-2 w-full rounded-md bg-white p-2">
            {d.total > 0 && <Minimize minimizeBox={minimizeBox} />}
            <div className="mb-5 flex justify-between align-top">
                <Edit editButtonClick={editButtonClick} />
                <span className="mr-2 self-start rounded bg-yellow-100 px-2.5 py-0.5 align-middle text-base font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Baru
                </span>

                <Delete deleteButtonClick={deleteButtonClick} />
            </div>
            <FormProvider {...method}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* NAME */}
                    <InputTextName
                        setNameIsUsed={setNameIsUsed}
                        setIsDisabled={setIsDisabled}
                    />
                    {/* SUB NAME */}
                    <InputDropdownSubName />
                    {watch("name") && (
                        <>
                            {/* DROPDOWN UNITS */}
                            <InputDropdownUnits />
                            {/* DETAIL UNITS */}
                            {watch("units")?.length > 1 && <InputUnitsDetail />}
                            {watch("master_unit_id") && (
                                <>
                                    {/* QUANTITY BUY PER UNIT */}
                                    <InputNumberQtyBuy />
                                    {watch("per_unit_qty") && (
                                        <InputPriceBuy
                                            inputByTotal={inputByTotal}
                                        />
                                    )}
                                    {watch("per_unit_qty") && (
                                        <InputPriceTotal
                                            inputByTotal={inputByTotal}
                                            setInputByTotal={setInputByTotal}
                                        />
                                    )}
                                    {watch("total")
                                        ? watch("units")?.length > 0 && (
                                              <InputPriceEstimatedSell />
                                          )
                                        : ""}
                                </>
                            )}
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                    >
                        Simpan
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}
