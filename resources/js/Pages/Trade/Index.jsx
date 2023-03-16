import ButtonMain from "@/Components/ButtonMain";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import Paginate from "@/Components/Table/Paginate";
import Search from "@/Components/Table/Search";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ auth, items, q }) {
    const [showJual, setShowJual] = useState(false);
    const [showBeli, setShowBeli] = useState(false);

    const closeModal = () => {
        setShowJual(false);
    };

    console.log(items);

    return (
        <AuthenticatedLayout auth={auth} className>
            <div className="p-6">
                <div>
                    <Head title="Jual Beli" />
                    <Link href={route("home")}>
                        <PrimaryButton className="m-2">Back</PrimaryButton>
                    </Link>
                </div>
                <div className="my-4 rounded-md bg-white p-4">
                    <ButtonMain
                        className="mb-3 w-full"
                        onClick={() => {
                            setShowJual(true);
                        }}
                    >
                        Jual
                    </ButtonMain>
                    <ButtonMain className="mb-3 w-full">Beli</ButtonMain>
                    <div className="mt-10">
                        <Search q={q} />
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 font-extrabold"
                                        >
                                            Nama
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            stok
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">
                                                Edit
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items?.data?.length ? (
                                        items?.data.map((d, i) => (
                                            <tr
                                                key={i}
                                                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                                >
                                                    {d.name}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {d.bottom_unit_qty}{" "}
                                                    {d.bottomUnit.name}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <a
                                                        href="#"
                                                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                    >
                                                        Edit
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="p-3 text-center"
                                            >
                                                Data Kosong
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {items?.data?.length ? (
                            <Paginate links={items?.links} meta={items?.meta} />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                <Modal show={showJual} onClose={closeModal}>
                    wkwk
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
