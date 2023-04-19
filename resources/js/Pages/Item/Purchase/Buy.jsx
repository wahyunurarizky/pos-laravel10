import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, createContext, useContext, useRef, useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import _ from "lodash";

import { toast } from "react-toastify";
import Checkout from "@/Pages/Item/Purchase/Components/Checkout";
import clsx from "clsx";
import BuyOption from "@/Pages/Item/Purchase/Components/BuyOption";
import ListItemPurchase from "@/Pages/Item/Purchase/Components/ListItemPurchase";

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

    function handleBeforeUnload(e) {
        e.preventDefault();
        e.returnValue = "";
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const submit = (seller_id) => {
        router.post(route("items.buy.save"), {
            items: box,
            total: box.reduce(
                (accumulator, currentValue) => accumulator + currentValue.total,
                0
            ),
            seller_id,
        });
    };

    const { errors } = usePage().props;

    useEffect(() => {
        if (!_.isEmpty(errors)) {
            toast.error(_.values(errors).join(", "));
        }
    }, [errors]);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Beli Barang" />
            <div className="p-6 pb-16">
                <div className="ease mb-2 flex justify-between">
                    <Link href={route("items.index")}>
                        <PrimaryButton
                            onClick={(e) => {
                                if (
                                    !confirm(
                                        "Are you sure you want to leave this page?"
                                    )
                                )
                                    e.preventDefault();
                            }}
                        >
                            Back
                        </PrimaryButton>
                    </Link>
                    <h3
                        className="text-3xl font-bold text-mycolor-dark"
                        ref={ref}
                    >
                        Beli Barang
                    </h3>
                </div>

                <BuyContext.Provider value={{ master_units, box, setBox }}>
                    {box.length > 0 &&
                        box.map((d, i) => (
                            <div className=" w-full" key={i}>
                                <div
                                    className={clsx(
                                        d.edit ? "max-h-[2000px]" : "max-h-0",
                                        "overflow-hidden transition-all duration-500"
                                    )}
                                >
                                    <BuyOption
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
                                        !d.edit ? "max-h-[2000px]" : "max-h-0",
                                        "overflow-hidden transition-opacity duration-500"
                                    )}
                                >
                                    <ListItemPurchase
                                        d={d}
                                        i={i}
                                        box={box}
                                        setBox={setBox}
                                    />
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
