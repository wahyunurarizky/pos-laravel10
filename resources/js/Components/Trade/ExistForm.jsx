import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputDropdownUnits from "./BuyField/InputDropdownUnits";
import InputTextName from "./BuyField/InputTextName";
import InputDropdownSubName from "./BuyField/InputDropdownSubName";
import InputUnitsDetail from "./BuyField/InputUnitsDetail";
import InputNumberQtyBuy from "./BuyField/InputNumberQtyBuy";
import InputPriceEstimatedSellExistForm from "./BuyField/InputPriceEstimatedSellExistForm";
import { useBuy } from "@/Pages/Trade/Buy";
import InputNumberQtyBuyExistForm from "./BuyField/InputNumberQtyBuyExistForm";
import InputPriceBuyExistForm from "./BuyField/InputPriceBuyExistForm";
import InputPriceTotalExistForm from "./BuyField/InputPriceTotalExistForm";

export const useBuyForm = useFormContext;

const schema = yup
    .object({
        units: yup.array().of(
            yup.object().shape({
                unitId: yup.number(),
                price: yup.number(),
            })
        ),
        unit_id: yup.number().required(),
        per_unit_qty: yup.string().required(),
        price_per_unit: yup.number().required(),
        total: yup.number().positive("the total not valid"),
    })
    .required();

export default function ExistForm({ setIsForm, updateBox, i, d, item_id }) {
    const [isLoading, setIsLoading] = useState(false);

    const method = useForm({
        defaultValues: {
            per_unit_qty: d.per_unit_qty,
            unit_id: d.unit_id,
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
        setError,
        reset,
        getValues,
        setValue,
    } = method;

    const [inputByTotal, setInputByTotal] = useState(d.inputByTotal || false);
    // const [nameIsUsed, setNameIsUsed] = useState(false);

    const onSubmit = (data) => {
        data.edit = false;
        data.isNew = false;
        data.inputByTotal = inputByTotal;
        data.isSaved = true;

        // if (nameIsUsed) {
        //     setError(
        //         "name",
        //         { message: "name already exists" },
        //         { shouldFocus: true }
        //     );
        //     return;
        // }
        // data.edit = false;
        updateBox({ ...d, ...data }, i);
        // setIsSearch(true);
        // router.post(
        //     route("trade.buy.store"),
        //     {
        //         ...data,
        //         name: data.name.toUpperCase(),
        //     },
        //     {
        //         onError: (err) => {
        //             console.log(err[0]);
        //         },
        //     }
        // );
    };

    console.log(errors, watch());

    register("units");

    useEffect(() => {
        if (d.isSaved) return;
        setIsLoading(true);
        axios
            .get(route("api.items.show", item_id))
            .then((response) => {
                console.log(response.data);
                updateBox({ ...d, apiData: response.data }, i);
                setValue(
                    "units",
                    response.data?.units?.map((d) => {
                        return {
                            unit_id: d.id,
                            unit_name: d.name,
                            price: d.pricing?.price,
                        };
                    })
                );
                setValue("unit_id", response.data?.units[0]?.id);
                setIsLoading(false);
            })
            .catch((_error) => {
                console.log(_error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            <h4 className="mb-3 inline-block rounded-sm bg-mycolor-dark px-2 text-base font-bold text-white">
                Beli
            </h4>

            {isLoading ? (
                "loading..."
            ) : (
                <FormProvider {...method}>
                    <button
                        onClick={() => {
                            setIsForm(false);
                        }}
                    >
                        ganti
                    </button>
                    <div className="w-full rounded-md bg-white">
                        nama: {d.apiData?.name}
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputNumberQtyBuyExistForm />
                        {watch("per_unit_qty") && (
                            <InputPriceBuyExistForm
                                inputByTotal={inputByTotal}
                            />
                        )}

                        {watch("per_unit_qty") && (
                            <InputPriceTotalExistForm
                                inputByTotal={inputByTotal}
                                setInputByTotal={setInputByTotal}
                            />
                        )}

                        {watch("total")
                            ? watch("units")?.length > 0 && (
                                  <InputPriceEstimatedSellExistForm />
                              )
                            : ""}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                        >
                            Simpan
                        </button>
                    </form>
                </FormProvider>
            )}
        </div>
    );
}
