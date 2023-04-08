import { useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import SearchBox from "@/Components/Trade/Sell/SearchBox";
import PrimaryButton from "@/Components/PrimaryButton";
import SellList from "@/Components/Trade/Sell/SellList";

export default function Sell({ auth }) {
    const [box, setBox] = useState([{ edit: true }]);

    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Jual Barang" />
            <div className="p-6 pb-16">
                <div className="mb-2 flex justify-between">
                    <Link href={route("trade.index")}>
                        <PrimaryButton className="">Back</PrimaryButton>
                    </Link>
                    <h3 className="text-3xl font-bold text-mycolor-dark">
                        Jual Barang
                    </h3>
                </div>
                {box.map((d) => (
                    <SellList />
                ))}
                {box.filter((v) => {
                    return v.edit === true;
                }).length === 0 && (
                    <button className="ml-auto mb-2 block">
                        Tambah <PlusCircleIcon className="inline h-7 w-7" />
                    </button>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
