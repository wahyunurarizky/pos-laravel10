import { createContext, useContext, useEffect, useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SellOption from "@/Pages/Item/Sale/Components/SellOption";
import clsx from "clsx";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CheckoutSell from "@/Pages/Item/Sale/Components/CheckoutSell";
import ListItemSell from "@/Pages/Item/Sale/Components/ListItemSell";
import _ from "lodash";
import { toast } from "react-toastify";
import { currencyFormat } from "@/Helpers/currencyFormat";

const SellContext = createContext();

export default function Sell({ auth }) {
    const [box, setBox] = useState([{ edit: true }]);

    const ref = useRef(null);

    const updateBox = (data, i) => {
        const boxTemp = [...box];
        boxTemp[i] = data;
        setBox(boxTemp);
        ref.current?.scrollIntoView({ behavior: "smooth" });
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
        setBox(arr);
    };

    const addNew = () => {
        setBox([...box, { edit: true }]);
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

    const submit = () => {
        router.post(route("items.sell.save"), {
            items: box,
            total: box.reduce(
                (accumulator, currentValue) => accumulator + currentValue.total,
                0
            ),
        });
    };

    const { errors } = usePage().props;
    useEffect(() => {
        if (!_.isEmpty(errors)) {
            toast.error(_.values(errors).join(", "));
        }
    }, [errors]);

    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Jual Barang" />
            <div className="p-6 pb-16">
                <div className="mb-2 flex justify-between">
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
                        Jual Barang
                    </h3>
                </div>
                <SellContext.Provider value={{ box, setBox }}>
                    {box.length > 0 &&
                        box.map((d, i) => (
                            <div className=" w-full" key={i}>
                                <div
                                    className={clsx(
                                        d.edit ? "max-h-[2000px]" : "max-h-0",
                                        "overflow-hidden transition-all duration-500"
                                    )}
                                >
                                    <SellOption
                                        d={d}
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
                                    />
                                </div>
                                <div
                                    className={clsx(
                                        !d.edit ? "max-h-[2000px]" : "max-h-0",
                                        "overflow-hidden transition-opacity duration-500"
                                    )}
                                >
                                    <ListItemSell
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
                                    Total:{" "}
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
                            <CheckoutSell submit={submit} />
                        </div>
                    )}
                </SellContext.Provider>
            </div>
        </AuthenticatedLayout>
    );
}

export const useSell = () => useContext(SellContext);
