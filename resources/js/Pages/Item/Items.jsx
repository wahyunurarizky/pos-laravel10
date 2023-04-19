import ButtonMain from "@/Components/ButtonMain";
import LoadingSpinner from "@/Components/LoadingSpinner";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import Paginate from "@/Components/Table/Paginate";
import Search from "@/Components/Table/Search";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import _ from "lodash";
import Label from "@/Components/Field/Label";
import { ShoppingBagIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Index({ auth, items, q, flash }) {
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const closeModal = () => {
        setShowDetail(false);
    };

    const closeModalDelete = () => {
        setShowConfirmDelete(false);
    };

    const {
        data,
        setData,
        post,
        processing,
        errors,
        put,
        delete: destroy,
    } = useForm({
        name: "",
    });

    const showDetailItem = (id) => {
        axios
            .get(route("api.items.show", id))
            .then((d) => {
                console.log(d);
                setDataDetail(d.data);
                setData({
                    sub_name: d.data.sub_name?.map((d) => ({
                        value: d,
                        label: d,
                    })),
                    name: d.data.name,
                });
                setShowDetail(true);
                setLoadingDetail(false);
            })
            .catch((e) => {
                console.log(e);
                setLoadingDetail(false);
            });
    };

    const { errors: e } = usePage().props;

    // useEffect(() => {
    //     if (flash.message) {
    //         toast.success(flash.message);
    //         setShowDetail(false);
    //     }
    // }, [flash]);

    // useEffect(() => {
    //     if (!_.isEmpty(e)) {
    //         toast.error(_.values(e).join(", "));
    //     }
    // }, [e]);

    function submit(e) {
        e.preventDefault();
        put(route("items.update", dataDetail.id));
    }

    const deleteItem = (e) => {
        destroy(route("items.destroy", dataDetail.id));
    };

    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Jual Beli" />
            <div className="md:p-6">
                <div className="bg-white p-4 md:rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Link href={route("items.sell")}>
                                <ButtonMain className="h-full w-full">
                                    Jual
                                    <ShoppingCartIcon className="w-12" />
                                </ButtonMain>
                            </Link>
                            <Link
                                href={route("items.history-sell")}
                                className="text-xs underline"
                            >
                                Riwayat Penjualan
                            </Link>
                        </div>
                        <div className="w-full text-right">
                            <Link href={route("items.buy")}>
                                <ButtonMain className="h-full w-full">
                                    <ShoppingBagIcon className="w-12" />
                                    Beli
                                </ButtonMain>
                            </Link>
                            <Link
                                href={route("items.history-buy")}
                                className="text-xs underline"
                            >
                                Riwayat pembelian
                            </Link>
                        </div>
                    </div>
                    <div className="mt-10 border-t-2 pt-3">
                        <h3 className="text-center text-xl font-bold">
                            Data Dagangan Saat Ini
                        </h3>
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
                                                Action
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
                                                <td className="flex px-6 py-4">
                                                    {d.stock
                                                        .slice(0)
                                                        .reverse()
                                                        .map((s, si) => (
                                                            <div
                                                                key={si}
                                                                className="mr-2 rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-gray-700 dark:text-green-400"
                                                            >
                                                                {s}
                                                            </div>
                                                        ))}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        className="mr-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                        disabled={loadingDetail}
                                                        onClick={(e) => {
                                                            setLoadingDetail(
                                                                true
                                                            );
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            showDetailItem(
                                                                d.id
                                                            );
                                                        }}
                                                    >
                                                        Lihat
                                                    </button>
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
                    <Modal show={showDetail} onClose={closeModal}>
                        {dataDetail && (
                            <div className="overflow-auto">
                                <div className="px-3">{dataDetail.name}</div>
                                <ul>
                                    {dataDetail.units?.map(
                                        (u, ind, arr) =>
                                            arr[ind + 1] && (
                                                <li key={ind}>
                                                    1 {u.name} ={" "}
                                                    {
                                                        arr[ind + 1]
                                                            ?.parent_ref_qty
                                                    }{" "}
                                                    {arr[ind + 1]?.name}
                                                </li>
                                            )
                                    )}
                                </ul>
                                <div>stok: {dataDetail.stock?.join(", ")}</div>
                                <div>
                                    setara dengan {dataDetail.bottom_unit_qty}{" "}
                                    {dataDetail.bottom_unit?.name}
                                </div>
                                <button
                                    onClick={() => {
                                        setShowConfirmDelete(true);
                                    }}
                                    className="absolute top-0 right-0"
                                >
                                    delete
                                </button>
                                <button
                                    onClick={(e) => {
                                        setIsEdit((p) => !p);
                                    }}
                                >
                                    edit
                                </button>
                                {isEdit && (
                                    <form onSubmit={submit}>
                                        <input
                                            value={data.name}
                                            onChange={(e) => {
                                                setData("name", e.target.value);
                                            }}
                                            type="name"
                                        />
                                        <div className="group relative z-0 mb-6 w-full">
                                            <Label
                                                name="sub_name"
                                                labelName="sub name"
                                            />

                                            <CreatableSelect
                                                onChange={(val) => {
                                                    setData(
                                                        "sub_name",
                                                        val.map((d) => d.value)
                                                    );
                                                }}
                                                menuPortalTarget={document.body}
                                                menuPosition={"fixed"}
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                                isMulti
                                                placeholder={
                                                    "ketik untuk menambahkan"
                                                }
                                                defaultValue={dataDetail.sub_name?.map(
                                                    (d) => ({
                                                        label: d,
                                                        value: d,
                                                    })
                                                )}
                                            />
                                        </div>
                                        <button type="submit">save</button>
                                    </form>
                                )}
                            </div>
                        )}
                        <Modal
                            show={showConfirmDelete}
                            onClose={closeModalDelete}
                        >
                            <div>yakin?</div>
                            <button onClick={deleteItem}>yes</button>
                        </Modal>
                    </Modal>
                </div>
            </div>
            {loadingDetail && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-500/75 opacity-75 dark:bg-gray-900/75">
                    <LoadingSpinner color="red" />
                </div>
            )}
        </AuthenticatedLayout>
    );
}
