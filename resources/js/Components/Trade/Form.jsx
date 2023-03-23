import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
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
        price_per_unit: yup.number().required(),
    })
    .required();

export default function Form() {
    const method = useForm({
        defaultValues: {
            sub_name: [],
            units: [],
            price_per_unit: 0,
            total: 0,
        },
        resolver: yupResolver(schema),
    });

    const { register, handleSubmit, watch } = method;

    const [inputByTotal, setInputByTotal] = useState(false);

    const errorPage = usePage().props.errors;
    console.log(errorPage);

    console.log(method.watch());

    const onSubmit = (data) => {
        router.post(route("trade.buy.store"), {
            ...data,
            name: data.name.toUpperCase(),
        });
    };

    register("units");

    return (
        <div>
            <h4 className="mb-3 inline-block rounded-sm bg-mycolor-dark px-2 text-base font-bold text-white">
                Buat Baru Barang
            </h4>

            {/* FORM PEMBELIAN JIKA BARANG BARU */}
            <FormProvider {...method}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* NAME */}
                    <InputTextName />
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
                        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                    >
                        Submit
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}
