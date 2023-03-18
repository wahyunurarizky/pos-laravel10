import PrimaryButton from "@/Components/PrimaryButton";
import SearchBox from "@/Components/input/SearchBox";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Buy({ auth, items, q }) {
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

                <div className="my-2 min-h-screen rounded-md bg-white p-4 shadow-lg">
                    <SearchBox />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
