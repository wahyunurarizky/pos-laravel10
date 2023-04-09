import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputPriceEstimatedSellExistForm from "./BuyField/InputPriceEstimatedSellExistForm";
import InputNumberQtyBuyExistForm from "./BuyField/InputNumberQtyBuyExistForm";
import InputPriceBuyExistForm from "./BuyField/InputPriceBuyExistForm";
import InputPriceTotalExistForm from "./BuyField/InputPriceTotalExistForm";
import Edit from "./Button/Edit";
import Delete from "./Button/Delete";
import Minimize from "./Button/Minimize";

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
        price_per_unit: yup.number().required().positive("the total not valid"),
        total: yup.number().positive("the total not valid"),
    })
    .required();

export default function ExistForm({
    minimizeBox,
    updateBox,
    deleteButtonClick,
    editButtonClick,
    d,
    item_id,
}) {
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

    const onSubmit = (data) => {
        data.edit = false;
        data.isNew = false;
        data.inputByTotal = inputByTotal;
        data.isSaved = true;

        updateBox({ ...d, ...data });
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
                updateBox({ ...d, apiData: response.data });
                setValue(
                    "units",
                    response.data?.units?.map((d) => {
                        return {
                            unit_id: d.id,
                            unit_name: d.name,
                            price: d.pricing?.price || 0,
                            price_per_unit:
                                d.item_purchase?.price_per_unit || 0,
                        };
                    })
                );
                setValue("unit_id", response.data?.units[0]?.id);
                setValue(
                    "price_per_unit",
                    response.data?.units[0]?.item_purchase?.price_per_unit
                );
                setIsLoading(false);
            })
            .catch((_error) => {
                console.log(_error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="shadow-0 mb-2 w-full rounded-md bg-white p-2 ">
            {d.total > 0 && <Minimize minimizeBox={minimizeBox} />}
            <div className="mb-5 flex justify-between align-top">
                <Edit editButtonClick={editButtonClick} />
                <span className=""></span>

                <Delete deleteButtonClick={deleteButtonClick} />
            </div>
            {isLoading ? (
                "loading..."
            ) : (
                <FormProvider {...method}>
                    <div className="mb-4 w-full rounded-md bg-white">
                        nama: {d.apiData?.name}
                        <h3>keterangan</h3>
                        <ul>
                            {d.apiData?.units.map(
                                (u, ind, arr) =>
                                    arr[ind + 1] && (
                                        <li key={ind}>
                                            1 {u.name} ={" "}
                                            {arr[ind + 1]?.parent_ref_qty}{" "}
                                            {arr[ind + 1]?.name}
                                        </li>
                                    )
                            )}
                        </ul>
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
