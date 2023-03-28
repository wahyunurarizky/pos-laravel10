import PrimaryButton from "@/Components/PrimaryButton";
import BuyForm from "@/Components/Trade/BuyForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, createContext, useContext, useRef } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import {
    ChevronRightIcon,
    MinusIcon,
    PlusCircleIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";

const BuyContext = createContext();

export default function Buy({ auth, master_units }) {
    const [box, setBox] = useState([{ edit: true }]);
    const ref = useRef(null);

    console.log("box", box);

    const updateBox = (data, i) => {
        const boxTemp = [...box];
        boxTemp[i] = data;
        setBox(boxTemp);
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    const { errors } = usePage().props;
    console.log(errors);

    const addNew = () => {
        setBox([...box, { edit: true }]);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Beli Barang" />
            <div className="p-6">
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
                                <div
                                    key={i}
                                    className={clsx(
                                        "w-full rounded-md bg-white p-2 shadow-md"
                                    )}
                                >
                                    <div className="flex justify-end">
                                        <button
                                            className="hover:scale-125"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBox(
                                                    box.filter(
                                                        (d, index) =>
                                                            i !== index
                                                    )
                                                );
                                            }}
                                        >
                                            <TrashIcon className="h-5 w-5 text-red-500" />
                                        </button>
                                        {d.total > 0 && (
                                            <button
                                                onClick={() => {
                                                    const arr = [...box];
                                                    arr[i] = {
                                                        ...box[i],
                                                        edit: false,
                                                    };
                                                    console.log(arr);
                                                    setBox(arr);
                                                }}
                                            >
                                                <MinusIcon className="h-6 w-6 text-gray-500" />
                                            </button>
                                        )}
                                    </div>

                                    <BuyForm
                                        updateBox={updateBox}
                                        i={i}
                                        d={d}
                                    />
                                </div>
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
                                    className="mb-2 flex w-full cursor-pointer items-center rounded-md bg-white p-2 shadow-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-100 active:bg-gray-300"
                                >
                                    <div className="w-full">
                                        <div className="font-bold">
                                            {d.isNew
                                                ? d.unit_name
                                                : d.apiData?.name}
                                        </div>
                                        <div className="flex cursor-pointer items-center text-sm">
                                            <div className="flex-none pr-2">
                                                {d.per_unit_qty}{" "}
                                                {d.isNew
                                                    ? d.unit_name
                                                    : d.units.find(
                                                          (d) =>
                                                              d.unit_id ==
                                                              d.unit_id
                                                      )?.unit_name}
                                            </div>
                                            <div className="flex-grow basis-1/2 text-right">
                                                @Rp {d.price_per_unit || "-"}
                                            </div>
                                            <div className="flex-grow basis-1/2 text-right">
                                                Rp {d.total}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBox(
                                                box.filter(
                                                    (d, index) => i !== index
                                                )
                                            );
                                        }}
                                        className="ml-5 h-7 w-7 flex-none rounded-xl bg-black hover:scale-125"
                                    >
                                        <TrashIcon className="m-auto h-5 w-5 text-white" />
                                    </button>
                                </div>
                            )
                        )}
                    {box.filter((v) => {
                        return v.edit === true;
                    }).length === 0 && (
                        <button onClick={addNew} className="ml-auto mb-2 block">
                            <PlusCircleIcon className="h-7 w-7" />
                        </button>
                    )}
                    {box.filter((v) => {
                        return v.edit === true;
                    }).length === 0 && (
                        <button
                            className="mr-2 mb-2 block w-full rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
                            onClick={() => {
                                router.post(route("trade.buy.store"), {
                                    items: box,
                                });
                            }}
                        >
                            BELI
                        </button>
                    )}
                </BuyContext.Provider>
            </div>
        </AuthenticatedLayout>
    );
}

export const useBuy = () => useContext(BuyContext);
