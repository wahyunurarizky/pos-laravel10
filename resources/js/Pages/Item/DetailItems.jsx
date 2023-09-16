import Label from "@/Components/Field/Label";
import LoadingSpinner from "@/Components/LoadingSpinner";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

export default function DetailItems({ id }) {
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const showDetailItem = () => {
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

    const closeModal = () => {
        setShowDetail(false);
    };

    const closeModalDelete = () => {
        setShowConfirmDelete(false);
    };
    const deleteItem = (e) => {
        destroy(route("items.destroy", dataDetail.id));
    };

    function submit(e) {
        e.preventDefault();
        put(route("items.update", dataDetail.id));
    }
    return (
        <div>
            <button
                className="mr-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
                disabled={loadingDetail}
                onClick={(e) => {
                    setLoadingDetail(true);
                    e.stopPropagation();
                    e.preventDefault();
                    showDetailItem();
                }}
            >
                Lihat
            </button>
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
                                            {arr[ind + 1]?.parent_ref_qty}{" "}
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
                                        placeholder={"ketik untuk menambahkan"}
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
                <Modal show={showConfirmDelete} onClose={closeModalDelete}>
                    <div>yakin?</div>
                    <button onClick={deleteItem}>yes</button>
                </Modal>
            </Modal>
            {loadingDetail && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-500/75 opacity-75 dark:bg-gray-900/75">
                    <LoadingSpinner color="red" />
                </div>
            )}
        </div>
    );
}
