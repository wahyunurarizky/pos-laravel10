import PrimaryButton from "@/Components/PrimaryButton";
import BuyForm from "@/Components/Trade/BuyForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, createContext, useContext } from "react";

const BuyContext = createContext();

export default function Buy({ auth, master_units }) {
    const [box, setBox] = useState(["1"]);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Beli Barang" />
            <div className="p-6">
                <div className="flex justify-between">
                    <Link href={route("trade.index")}>
                        <PrimaryButton className="m-2">Back</PrimaryButton>
                    </Link>
                    <h3 className="text-3xl font-bold text-mycolor-dark">
                        Beli Barang
                    </h3>
                    <div></div>
                </div>

                <BuyContext.Provider value={{ master_units }}>
                    <div className="my-2 min-h-screen rounded-md bg-white p-4 shadow-lg">
                        {box.map((d, i) => (
                            <BuyForm key={i} />
                        ))}
                    </div>
                </BuyContext.Provider>
            </div>
        </AuthenticatedLayout>
    );
}

export const useBuy = () => useContext(BuyContext);
