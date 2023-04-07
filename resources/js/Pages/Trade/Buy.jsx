import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, createContext, useContext, useRef } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import { toast } from "react-toastify";
import BuyOption from "@/Components/Trade/BuyOption";
import Checkout from "@/Components/Trade/Button/Checkout";

const BuyContext = createContext();

export default function Buy({ auth, master_units }) {
    const [box, setBox] = useState([{ edit: true }]);

    const ref = useRef(null);

    const updateBox = (data, i) => {
        const boxTemp = [...box];
        boxTemp[i] = data;
        setBox(boxTemp);
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    const { errors } = usePage().props;

    const addNew = () => {
        setBox([...box, { edit: true }]);
    };

    const deleteBox = (i) => {
        setBox(box.filter((d, index) => i !== index));
    };
    const minimizeBox = (i) => {
        const arr = [...box];
        arr[i] = {
            ...box[i],
            edit: false,
        };
        console.log(arr);
        setBox(arr);
    };

    const currencyFormat = (num) => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    const submit = (seller_id) => {
        router.post(route("trade.buy.store"), {
            items: box.map((d) => ({ ...d, seller_id })),
            total: box.reduce(
                (accumulator, currentValue) => accumulator + currentValue.total,
                0
            ),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Beli Barang" />
            <div className="p-6 pb-16">
                <div className="mb-2 flex justify-between">
                    <Link href={route("trade.index")}>
                        <PrimaryButton className="">Back</PrimaryButton>
                    </Link>
                    <h3
                        className="text-3xl font-bold text-mycolor-dark"
                        ref={ref}
                    >
                        Beli Barang
                    </h3>
                </div>

                <BuyContext.Provider value={{ master_units, box }}>
                    {box.length > 0 &&
                        box.map((d, i) =>
                            d.edit ? (
                                <BuyOption
                                    key={i}
                                    updateBox={(data) => {
                                        updateBox(data, i);
                                    }}
                                    deleteBox={() => {
                                        deleteBox(i);
                                    }}
                                    minimizeBox={() => {
                                        minimizeBox(i);
                                    }}
                                    i={i}
                                    d={d}
                                />
                            ) : (
                                <div
                                    onClick={() => {
                                        if (!box.find((d) => !d.isSaved)) {
                                            setBox(
                                                box.map((data, index) => {
                                                    const edit = index === i;
                                                    return {
                                                        ...data,
                                                        edit,
                                                    };
                                                })
                                            );
                                        } else {
                                            toast.error(
                                                "ada pembelian yg belum disimpan"
                                            );
                                        }
                                    }}
                                    key={i}
                                    className="mb-2 flex w-full cursor-pointer items-center rounded-md bg-white p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-100 active:bg-gray-100"
                                >
                                    <div className="w-full">
                                        <div className="font-bold">
                                            {d.isNew ? d.name : d.apiData?.name}
                                        </div>
                                        <div className="flex cursor-pointer items-end text-sm">
                                            <div className="basis-1/6 pr-2">
                                                {d.per_unit_qty}{" "}
                                                {d.isNew
                                                    ? d.unit_name
                                                    : d.units.find(
                                                          (data) =>
                                                              data.unit_id ==
                                                              d.unit_id
                                                      )?.unit_name}
                                            </div>
                                            <div className="flex-grow basis-1/3 pl-2 text-right">
                                                @Rp{" "}
                                                {currencyFormat(
                                                    d.price_per_unit
                                                ) || "-"}
                                            </div>
                                            <div className="flex-grow basis-1/3 pl-2 text-right">
                                                Rp {currencyFormat(d.total)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    {box.filter((v) => {
                        return v.edit === true;
                    }).length === 0 && (
                        <button onClick={addNew} className="ml-auto mb-2 block">
                            Tambah <PlusCircleIcon className="inline h-7 w-7" />
                        </button>
                    )}
                    {box.filter((v) => {
                        return v.edit === true;
                    }).length === 0 && (
                        <div className="fixed inset-x-0 bottom-0 px-2 pb-4 pt-2 backdrop-blur-2xl">
                            <div className="text-right">
                                <span className="font-semibold">
                                    Total: Rp{" "}
                                    {currencyFormat(
                                        box.reduce(
                                            (accumulator, currentValue) =>
                                                accumulator +
                                                currentValue.total,
                                            0
                                        )
                                    )}
                                </span>
                            </div>
                            <Checkout submit={submit} />
                        </div>
                    )}
                </BuyContext.Provider>
            </div>
        </AuthenticatedLayout>
    );
}

export const useBuy = () => useContext(BuyContext);
