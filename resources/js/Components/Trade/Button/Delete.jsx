import Modal from "@/Components/Modal";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function Delete({ deleteButtonClick }) {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="flex align-middle">
                <button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    className="hover:scale-125"
                >
                    <TrashIcon className="m-auto h-5 w-5 " />
                </button>
            </div>
            <Modal show={showModal} onClose={closeModal}>
                <div className="w-full rounded-lg bg-white shadow dark:bg-gray-700">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        onClick={closeModal}
                    >
                        <XMarkIcon className="h-5 w-5" />
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        <InformationCircleIcon className="mx-auto h-16 w-16 text-gray-500" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apa anda yakin ingin menghapus item ini?
                        </h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteButtonClick();
                            }}
                            type="button"
                            className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                        >
                            Ya, yakin
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
