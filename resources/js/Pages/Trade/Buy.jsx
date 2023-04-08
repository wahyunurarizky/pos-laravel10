import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, createContext, useContext, useRef } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import { toast } from "react-toastify";
import BuyOption from "@/Components/Trade/BuyOption";
import Checkout from "@/Components/Trade/Button/Checkout";
import ListItemPurchase from "@/Components/Trade/BuyField/ListItemPurchase";
import { Transition } from "@headlessui/react";
import clsx from "clsx";

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

    const [test, setTest] = useState(false);

    console.log(box);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Beli Barang" />
            <div className="p-6 pb-16">
                <div
                    className="ease mb-2 flex justify-between"
                    onClick={() => {
                        setTest((p) => !p);
                    }}
                >
                    <Link href={route("trade.index")}>
                        <PrimaryButton className="">Back</PrimaryButton>
                    </Link>
                    <h3
                        className="text-3xl font-bold text-mycolor-dark"
                        ref={ref}
                    >
                        Beli Barang
                    </h3>
                    <div
                        class={`w-2 overflow-hidden bg-blue-500 transition-all duration-500 ${
                            test ? "max-h-40" : "max-h-0"
                        }`}
                    >
                        <div>a</div>
                        <div>b</div>
                        <div>c</div>
                        <div>c</div>
                        <div>c</div>
                    </div>
                </div>

                <BuyContext.Provider value={{ master_units, box, setBox }}>
                    {box.length > 0 &&
                        box.map((d, i) => (
                            <div className=" w-full">
                                <div
                                    className={clsx(
                                        d.edit ? "max-h-[1000px]" : "max-h-0",
                                        "overflow-hidden transition-all duration-500"
                                    )}
                                >
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
                                </div>
                                <div
                                    className={clsx(
                                        !d.edit ? "max-h-[1000px]" : "max-h-0",
                                        "overflow-hidden transition-opacity duration-500"
                                    )}
                                >
                                    <ListItemPurchase key={i} d={d} i={i} />
                                </div>
                            </div>
                        ))}
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
