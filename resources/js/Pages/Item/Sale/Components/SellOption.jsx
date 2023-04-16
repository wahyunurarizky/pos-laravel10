import React, { useState } from "react";
import { useSell } from "@/Pages/Item/Sale/Sell";
import { toast } from "react-toastify";
import Form from "./Form";
import SearchBox from "./SearchBox";

export default function SellOption({ updateBox, d, deleteBox, minimizeBox }) {
    const [isForm, setIsForm] = useState(Boolean(d.total > 0));
    const { box } = useSell();

    const makeExistForm = (item_id) => {
        if (box.some((el) => el.item_id === item_id)) {
            toast.error("item sudah ada di list pembelian");
            return;
        }

        updateBox({
            item_id,
            edit: true,
        });
        setIsForm(true);
    };

    const editButtonClick = (e) => {
        e.stopPropagation();
        updateBox({ edit: true });
        setIsForm(false);
    };

    const deleteButtonClick = (e) => {
        e.stopPropagation();
        deleteBox();
    };

    return isForm ? (
        <Form
            item_id={d.item_id}
            updateBox={updateBox}
            d={d}
            minimizeBox={minimizeBox}
            editButtonClick={editButtonClick}
            deleteButtonClick={deleteButtonClick}
            setIsForm={setIsForm}
        />
    ) : (
        <SearchBox
            makeExistForm={makeExistForm}
            deleteButtonClick={deleteButtonClick}
        />
    );
}
