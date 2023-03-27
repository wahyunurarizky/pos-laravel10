import PrimaryButton from "@/Components/PrimaryButton";
import BuyForm from "@/Components/Trade/BuyForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, createContext, useContext, useRef } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import {
    ChevronRightIcon,
    MinusIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Head title="Beli Barang" />
            <div className="p-6">
                <div className="flex justify-between">
                    <Link href={route("trade.index")}>
                        <PrimaryButton className="m-2">Back</PrimaryButton>
                    </Link>
                    <h3
                        className="text-3xl font-bold text-mycolor-dark"
                        ref={ref}
                    >
                        Beli Barang
                    </h3>
                </div>

                <BuyContext.Provider value={{ master_units, box }}>
                    <div className="my-2 rounded-md bg-white p-4 shadow-lg ">
                        {box.length > 0 &&
                            box.map((d, i) =>
                                d.edit ? (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "w-full rounded-md p-2 shadow-md"
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
                                        key={i}
                                        className={clsx(
                                            "w-full cursor-pointer rounded-md bg-mycolor-light p-2 shadow-md hover:bg-cyan-600 focus:outline-none focus:ring focus:ring-cyan-300 active:bg-cyan-700"
                                        )}
                                        onClick={() => {
                                            if (!box.find((d) => !d.isSaved)) {
                                                setBox(
                                                    box.map((data, index) => {
                                                        const edit =
                                                            index === i;
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
                                        </div>

                                        <div className="flex cursor-pointer text-sm font-bold ">
                                            <div className="flex-none pr-2">
                                                {d.per_unit_qty}
                                            </div>
                                            <div className="basis-1/4">
                                                {d.isNew
                                                    ? `${d.name} (${d.unit_name})`
                                                    : `${d.apiData?.name} (${
                                                          d.units.find(
                                                              (d) =>
                                                                  d.unit_id ==
                                                                  d.unit_id
                                                          )?.unit_name
                                                      })`}
                                            </div>
                                            <div className="flex-grow basis-1/3 text-right">
                                                @Rp {d.price_per_unit || "-"}
                                            </div>
                                            <div className="flex-grow basis-1/3 text-right">
                                                Rp {d.total}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        {box.filter((v) => {
                            return v.edit === true;
                        }).length === 0 && (
                            <button onClick={addNew}>tambah</button>
                        )}
                    </div>
                    {box.filter((v) => {
                        return v.edit === true;
                    }).length === 0 && (
                        <button
                            className="border-2 border-mycolor-dark"
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
